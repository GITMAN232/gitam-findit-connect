
// Define base types for our database items
export interface BaseItem {
  id: number;
  created_at: string;
  user_id: string;
  item_name: string;
  description: string;
  location: string;
  image_url: string | null;
  status: string;
}

// Database response types (without the type field)
export interface LostItemDB extends BaseItem {
  lost_date: string;
  contact_info: string;
}

export interface FoundItemDB extends BaseItem {
  found_date: string;
  email: string;
  phone: string | null;
}

// Types for our listings with the type discriminator
export interface LostItem extends LostItemDB {
  type: 'lost';
}

export interface FoundItem extends FoundItemDB {
  type: 'found';
}

export type ListingItem = LostItem | FoundItem;

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
