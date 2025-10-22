-- Grant admin access to santhosh23263@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('352d034e-dd4b-45b7-8ec6-6282548259a3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Optional: Create a function to automatically grant admin to whitelisted emails on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_emails text[] := ARRAY[
    'santhosh23263@gmail.com',
    'admin@glostandfound.com'
  ];
BEGIN
  -- If the new user's email is in the admin whitelist, grant them admin role
  IF NEW.email = ANY(admin_emails) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically grant admin to whitelisted emails
DROP TRIGGER IF EXISTS on_auth_user_created_admin_check ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_admin_check();