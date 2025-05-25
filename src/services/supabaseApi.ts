
import { supabase } from "@/integrations/supabase/client";

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

// Upload image to Supabase Storage
export const uploadImage = async (file: File, bucket: string = 'object-images'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

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

export const fetchLostObjects = async () => {
  const { data, error } = await supabase
    .from('lost_objects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => ({ ...item, type: 'lost' }));
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

export const fetchFoundObjects = async () => {
  const { data, error } = await supabase
    .from('found_objects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => ({ ...item, type: 'found' }));
};
