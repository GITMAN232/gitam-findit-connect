-- Drop existing views first
DROP VIEW IF EXISTS public.public_found_objects CASCADE;
DROP VIEW IF EXISTS public.public_lost_objects CASCADE;

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update status column defaults
ALTER TABLE public.lost_objects 
ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.found_objects
ALTER COLUMN status SET DEFAULT 'pending';

-- Add admin fields to lost_objects
ALTER TABLE public.lost_objects
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_note TEXT;

-- Add admin fields to found_objects
ALTER TABLE public.found_objects
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_note TEXT;

-- Create claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('lost', 'found')),
  claimant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  evidence_urls TEXT[],
  explanation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_id UUID REFERENCES auth.users(id),
  admin_note TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on claims
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- RLS policies for claims
CREATE POLICY "Users can view their own claims"
ON public.claims
FOR SELECT
USING (auth.uid() = claimant_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create claims"
ON public.claims
FOR INSERT
WITH CHECK (auth.uid() = claimant_id);

CREATE POLICY "Admins can manage all claims"
ON public.claims
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('submission_approved', 'submission_rejected', 'claim_approved', 'claim_rejected', 'item_claimed')),
  read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Create activity_logs table for admin tracking
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS policy: Only admins can view activity logs
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Recreate public views to only show approved items
CREATE VIEW public.public_found_objects WITH (security_invoker=true) AS
SELECT 
  id,
  object_name,
  description,
  location,
  found_date,
  image_url,
  status,
  campus,
  created_at
FROM public.found_objects
WHERE status = 'approved';

CREATE VIEW public.public_lost_objects WITH (security_invoker=true) AS
SELECT 
  id,
  object_name,
  description,
  location,
  lost_date,
  image_url,
  status,
  campus,
  created_at
FROM public.lost_objects
WHERE status = 'approved';

-- Grant permissions
GRANT SELECT ON public.public_found_objects TO anon, authenticated;
GRANT SELECT ON public.public_lost_objects TO anon, authenticated;

-- Create storage bucket for claim evidence
INSERT INTO storage.buckets (id, name, public)
VALUES ('claim-evidence', 'claim-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for claim evidence
CREATE POLICY "Users can upload their own claim evidence"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'claim-evidence' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own claim evidence"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'claim-evidence' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Admins can view all claim evidence"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'claim-evidence' AND
  public.has_role(auth.uid(), 'admin')
);

-- Create function to update updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger for claims
CREATE TRIGGER update_claims_updated_at
BEFORE UPDATE ON public.claims
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();