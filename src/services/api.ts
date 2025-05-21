
import { supabase } from "@/contexts/AuthContext";
import { ListingItem, LostItem, FoundItem, LostItemDB, FoundItemDB } from "@/types/ListingTypes";

/**
 * Fetch all lost items from the database
 */
export const fetchLostItems = async (): Promise<LostItem[]> => {
  const { data, error } = await supabase
    .from("lost_items")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  
  // Transform the database results to include the type field
  return (data || []).map(item => {
    // First assert the item as unknown, then as our expected type
    const lostItem = item as unknown as LostItemDB;
    return {
      ...lostItem,
      type: 'lost' as const
    };
  });
};

/**
 * Fetch all found items from the database
 */
export const fetchFoundItems = async (): Promise<FoundItem[]> => {
  const { data, error } = await supabase
    .from("found_items")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  
  // Transform the database results to include the type field
  return (data || []).map(item => {
    // First assert the item as unknown, then as our expected type
    const foundItem = item as unknown as FoundItemDB;
    return {
      ...foundItem,
      type: 'found' as const
    };
  });
};

/**
 * Fetch a specific lost item by ID
 */
export const fetchLostItemById = async (id: number): Promise<LostItem | null> => {
  const { data, error } = await supabase
    .from("lost_items")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) throw error;
  if (!data) return null;
  
  const lostItem = data as unknown as LostItemDB;
  return {
    ...lostItem,
    type: 'lost' as const
  };
};

/**
 * Fetch a specific found item by ID
 */
export const fetchFoundItemById = async (id: number): Promise<FoundItem | null> => {
  const { data, error } = await supabase
    .from("found_items")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) throw error;
  if (!data) return null;
  
  const foundItem = data as unknown as FoundItemDB;
  return {
    ...foundItem,
    type: 'found' as const
  };
};
