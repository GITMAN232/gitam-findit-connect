-- Final security fixes

-- 1. Drop the remaining "data found" table (note the space in the name)
DROP TABLE IF EXISTS "data found";

-- 2. Check and fix any remaining views that might have security definer issues
-- Let's ensure our new views are created properly without security definer
DROP VIEW IF EXISTS public.public_found_objects CASCADE;
DROP VIEW IF EXISTS public.public_lost_objects CASCADE;

-- Recreate the views explicitly as SECURITY INVOKER (default)
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
WHERE status = 'active';

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
WHERE status = 'active';

-- Grant appropriate permissions
GRANT SELECT ON public.public_found_objects TO anon, authenticated;
GRANT SELECT ON public.public_lost_objects TO anon, authenticated;