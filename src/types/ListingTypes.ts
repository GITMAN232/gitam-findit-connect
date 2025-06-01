
// Define base types for our database objects
export interface BaseObject {
  id: string; // Changed from number to string to match UUID
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

// Public view types for browsing (without sensitive contact info)
export interface PublicLostObjectDB {
  id: string;
  object_name: string;
  description: string;
  location: string;
  lost_date: string;
  created_at: string;
  image_url: string | null;
  status: string;
}

export interface PublicFoundObjectDB {
  id: string;
  object_name: string;
  description: string;
  location: string;
  found_date: string;
  created_at: string;
  image_url: string | null;
  status: string;
}

// Types for our listings with the type discriminator
export interface LostObject extends LostObjectDB {
  type: 'lost';
}

export interface FoundObject extends FoundObjectDB {
  type: 'found';
}

// Public listing types for browsing
export interface PublicLostObject extends PublicLostObjectDB {
  type: 'lost';
}

export interface PublicFoundObject extends PublicFoundObjectDB {
  type: 'found';
}

export type ListingObject = LostObject | FoundObject;
export type PublicListingObject = PublicLostObject | PublicFoundObject;

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
