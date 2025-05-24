import { ListingObject, LostObject, FoundObject, LostObjectDB, FoundObjectDB } from "@/types/ListingTypes";

// Mock data for lost objects
const mockLostObjects: LostObject[] = [
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

// Mock data for found objects
const mockFoundObjects: FoundObject[] = [
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
 * Fetch all lost objects (mock implementation)
 */
export const fetchLostObjects = async (): Promise<LostObject[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLostObjects;
};

/**
 * Fetch all found objects (mock implementation)
 */
export const fetchFoundObjects = async (): Promise<FoundObject[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFoundObjects;
};

/**
 * Fetch a specific lost object by ID (mock implementation)
 */
export const fetchLostObjectById = async (id: number): Promise<LostObject | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const object = mockLostObjects.find(object => object.id === id);
  return object || null;
};

/**
 * Fetch a specific found object by ID (mock implementation)
 */
export const fetchFoundObjectById = async (id: number): Promise<FoundObject | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const object = mockFoundObjects.find(object => object.id === id);
  return object || null;
};

// Keep the old function names for backward compatibility
export const fetchLostItems = fetchLostObjects;
export const fetchFoundItems = fetchFoundObjects;
export const fetchLostItemById = fetchLostObjectById;
export const fetchFoundItemById = fetchFoundObjectById;
