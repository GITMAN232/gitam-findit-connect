
import { ListingItem, LostItem, FoundItem, LostItemDB, FoundItemDB } from "@/types/ListingTypes";

// Mock data for lost items
const mockLostItems: LostItem[] = [
  {
    id: 1,
    created_at: "2025-04-10T15:30:00Z",
    user_id: "user-123",
    item_name: "MacBook Pro",
    description: "Silver MacBook Pro 16-inch, 2023 model with stickers on the cover",
    location: "University Library, 2nd Floor",
    image_url: "/placeholder.svg",
    status: "active",
    lost_date: "2025-04-09T14:00:00Z",
    contact_info: "john.doe@example.com",
    type: "lost"
  },
  {
    id: 2,
    created_at: "2025-04-12T10:45:00Z",
    user_id: "user-456",
    item_name: "Blue Hydroflask",
    description: "Navy blue 32oz Hydroflask water bottle with some stickers",
    location: "Science Building, Room 301",
    image_url: null,
    status: "active",
    lost_date: "2025-04-12T09:30:00Z",
    contact_info: "alice.smith@example.com",
    type: "lost"
  }
];

// Mock data for found items
const mockFoundItems: FoundItem[] = [
  {
    id: 1,
    created_at: "2025-04-11T09:20:00Z",
    user_id: "user-789",
    item_name: "Student ID Card",
    description: "Student ID card for Jane Doe",
    location: "Student Center, Cafeteria",
    image_url: "/placeholder.svg",
    status: "active",
    found_date: "2025-04-11T08:30:00Z",
    email: "mike.brown@example.com",
    phone: "555-123-4567",
    type: "found"
  },
  {
    id: 2,
    created_at: "2025-04-13T16:15:00Z",
    user_id: "user-101",
    item_name: "Reading Glasses",
    description: "Black-framed reading glasses in a blue case",
    location: "Main Hall, Lost & Found Box",
    image_url: null,
    status: "active",
    found_date: "2025-04-13T14:00:00Z",
    email: "sarah.jones@example.com",
    phone: null,
    type: "found"
  }
];

/**
 * Fetch all lost items (mock implementation)
 */
export const fetchLostItems = async (): Promise<LostItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLostItems;
};

/**
 * Fetch all found items (mock implementation)
 */
export const fetchFoundItems = async (): Promise<FoundItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFoundItems;
};

/**
 * Fetch a specific lost item by ID (mock implementation)
 */
export const fetchLostItemById = async (id: number): Promise<LostItem | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const item = mockLostItems.find(item => item.id === id);
  return item || null;
};

/**
 * Fetch a specific found item by ID (mock implementation)
 */
export const fetchFoundItemById = async (id: number): Promise<FoundItem | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const item = mockFoundItems.find(item => item.id === id);
  return item || null;
};

/**
 * NOTE: These mock implementations can be replaced with actual Supabase queries
 * once the database tables are set up. Example implementation for reference:
 * 
 * export const fetchLostItems = async (): Promise<LostItem[]> => {
 *   const { data, error } = await supabase
 *     .from("lost_items")
 *     .select("*")
 *     .order("created_at", { ascending: false });
 *     
 *   if (error) throw error;
 *   
 *   return (data || []).map(item => {
 *     const lostItem = item as unknown as LostItemDB;
 *     return {
 *       ...lostItem,
 *       type: 'lost' as const
 *     };
 *   });
 * };
 */
