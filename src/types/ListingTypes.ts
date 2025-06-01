
// Define base types for our database objects
export interface BaseObject {
  id: number;
  created_at: string;
  user_id: string;
  object_name: string;
  description: string;
  location: string;
  image_url: string | null;
  status: string;
}

// Database response types (without the type field)
export interface LostObjectDB extends BaseObject {
  lost_date: string;
  contact_info: string;
}

export interface FoundObjectDB extends BaseObject {
  found_date: string;
  email: string;
  phone: string | null;
}

// Types for our listings with the type discriminator
export interface LostObject extends LostObjectDB {
  type: 'lost';
}

export interface FoundObject extends FoundObjectDB {
  type: 'found';
}

export type ListingObject = LostObject | FoundObject;

// Categories for filtering
export const categories = [
  "All categories",
  "Electronics",
  "Books & Notes",
  "ID Cards",
  "Keys",
  "Wallets & Purses",
  "Clothing",
  "Accessories",
  "Others",
];
