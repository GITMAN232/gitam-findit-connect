-- Critical Security Fixes
-- Phase 1: Remove Security Definer Views and Fix Database Issues

-- 1. Drop the problematic Security Definer views
DROP VIEW IF EXISTS public.public_found_objects;
DROP VIEW IF EXISTS public.public_lost_objects;

-- 2. Remove the orphaned 'data found' table that has no clear purpose
DROP TABLE IF EXISTS public.data_found;

-- 3. Clean up duplicate RLS policies on found_objects table
-- First, drop all existing policies to clean slate
DROP POLICY IF EXISTS "Anyone can view found objects" ON public.found_objects;
DROP POLICY IF EXISTS "Users can create their own found object reports" ON public.found_objects;
DROP POLICY IF EXISTS "Users can delete their own found object reports" ON public.found_objects;
DROP POLICY IF EXISTS "Users can delete their own found objects" ON public.found_objects;
DROP POLICY IF EXISTS "Users can insert their own found objects" ON public.found_objects;
DROP POLICY IF EXISTS "Users can update their own found object reports" ON public.found_objects;
DROP POLICY IF EXISTS "Users can update their own found objects" ON public.found_objects;
DROP POLICY IF EXISTS "Users can view their own found objects" ON public.found_objects;

-- 4. Clean up duplicate RLS policies on lost_objects table
DROP POLICY IF EXISTS "Anyone can view lost objects" ON public.lost_objects;
DROP POLICY IF EXISTS "Users can create their own lost object reports" ON public.lost_objects;
DROP POLICY IF EXISTS "Users can delete their own lost object reports" ON public.lost_objects;
DROP POLICY IF EXISTS "Users can delete their own lost objects" ON public.lost_objects;
DROP POLICY IF EXISTS "Users can insert their own lost objects" ON public.lost_objects;
DROP POLICY IF EXISTS "Users can update their own lost object reports" ON public.lost_objects;
DROP POLICY IF EXISTS "Users can update their own lost objects" ON public.lost_objects;
DROP POLICY IF EXISTS "Users can view their own lost objects" ON public.lost_objects;

-- 5. Create clean, consolidated RLS policies for found_objects
CREATE POLICY "Public can view active found objects" 
ON public.found_objects 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can manage their own found objects" 
ON public.found_objects 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 6. Create clean, consolidated RLS policies for lost_objects
CREATE POLICY "Public can view active lost objects" 
ON public.lost_objects 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can manage their own lost objects" 
ON public.lost_objects 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 7. Add security documentation
COMMENT ON TABLE public.found_objects IS 'Found objects reported by users. RLS ensures users can only modify their own reports, but all active reports are publicly viewable.';
COMMENT ON TABLE public.lost_objects IS 'Lost objects reported by users. RLS ensures users can only modify their own reports, but all active reports are publicly viewable.';

-- 8. Create secure replacement views without SECURITY DEFINER
CREATE VIEW public.public_found_objects AS
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
WHERE status = 'active';

CREATE VIEW public.public_lost_objects AS
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
WHERE status = 'active';