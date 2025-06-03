import { supabase } from "@/integrations/supabase/client";
import { PublicLostObject, PublicFoundObject } from "@/types/ListingTypes";

export interface LostObjectData {
  object_name: string;
  description: string;
  location: string;
  lost_date: string;
  contact_info: string;
  image_url?: string;
}

export interface FoundObjectData {
  object_name: string;
  description: string;
  location: string;
  found_date: string;
  email: string;
  phone?: string;
  image_url?: string;
}

// Upload image to Supabase Storage with user-specific folder structure
export const uploadImage = async (file: File, bucket: string = 'object-images'): Promise<string> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to upload images');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  // Create user-specific folder structure as required by RLS policies
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

// Lost Objects API
export const createLostObject = async (data: LostObjectData) => {
  const { data: result, error } = await supabase
    .from('lost_objects')
    .insert([{
      ...data,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
};

// Fetch lost objects using the public view for browsing (no authentication required)
export const fetchLostObjects = async (): Promise<PublicLostObject[]> => {
  const { data, error } = await supabase
    .from('public_lost_objects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lost objects:', error);
    // Return empty array for graceful degradation
    return [];
  }
  
  return data.map(item => ({
    id: item.id!,
    object_name: item.object_name!,
    description: item.description!,
    location: item.location!,
    lost_date: item.lost_date!,
    created_at: item.created_at!,
    image_url: item.image_url,
    status: item.status!,
    type: 'lost' as const
  }));
};

// Fetch user's own lost objects (requires authentication)
export const fetchUserLostObjects = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('lost_objects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => ({ ...item, type: 'lost' as const }));
};

// Found Objects API
export const createFoundObject = async (data: FoundObjectData) => {
  const { data: result, error } = await supabase
    .from('found_objects')
    .insert([{
      ...data,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
};

// Fetch found objects using the public view for browsing (no authentication required)
export const fetchFoundObjects = async (): Promise<PublicFoundObject[]> => {
  const { data, error } = await supabase
    .from('public_found_objects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching found objects:', error);
    // Return empty array for graceful degradation
    return [];
  }
  
  return data.map(item => ({
    id: item.id!,
    object_name: item.object_name!,
    description: item.description!,
    location: item.location!,
    found_date: item.found_date!,
    created_at: item.created_at!,
    image_url: item.image_url,
    status: item.status!,
    type: 'found' as const
  }));
};

// Fetch user's own found objects (requires authentication)
export const fetchUserFoundObjects = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('found_objects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => ({ ...item, type: 'found' as const }));
};

// Get full details of a specific object (with contact info) - requires authentication
export const getLostObjectDetails = async (id: string) => {
  const { data, error } = await supabase
    .from('lost_objects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return { ...data, type: 'lost' as const };
};

export const getFoundObjectDetails = async (id: string) => {
  const { data, error } = await supabase
    .from('found_objects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return { ...data, type: 'found' as const };
};
