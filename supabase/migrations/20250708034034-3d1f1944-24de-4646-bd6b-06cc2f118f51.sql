-- Add campus field to lost_objects table
ALTER TABLE public.lost_objects 
ADD COLUMN campus text NOT NULL DEFAULT 'Vizag';

-- Add campus field to found_objects table  
ALTER TABLE public.found_objects
ADD COLUMN campus text NOT NULL DEFAULT 'Vizag';

-- Update the public views to include campus field
DROP VIEW IF EXISTS public.public_lost_objects;
CREATE VIEW public.public_lost_objects AS
SELECT 
  id,
  object_name,
  description,
  location,
  lost_date,
  image_url,
  status,
  created_at,
  campus
FROM public.lost_objects
WHERE status = 'active';

DROP VIEW IF EXISTS public.public_found_objects;
CREATE VIEW public.public_found_objects AS
SELECT 
  id,
  object_name,
  description,
  location,
  found_date,
  image_url,
  status,
  created_at,
  campus
FROM public.found_objects
WHERE status = 'active';