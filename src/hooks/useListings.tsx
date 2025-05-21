
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/contexts/AuthContext";
import { ListingItem, LostItem, FoundItem, LostItemDB, FoundItemDB } from "@/types/ListingTypes";

export const PAGE_SIZE = 8;

export const useListings = (searchQuery: string, category: string, activeTab: string) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);

  // Fetch lost items with proper type handling
  const fetchLostItems = async (): Promise<LostItem[]> => {
    const { data, error } = await supabase
      .from("lost_items")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    
    // Transform the database results to include the type field
    // Use type assertion to tell TypeScript that each item has the shape we expect
    return (data || []).map(item => {
      // First assert the item as unknown, then as our expected type
      const lostItem = item as unknown as LostItemDB;
      return {
        ...lostItem,
        type: 'lost' as const
      };
    });
  };

  // Fetch found items with proper type handling
  const fetchFoundItems = async (): Promise<FoundItem[]> => {
    const { data, error } = await supabase
      .from("found_items")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    
    // Transform the database results to include the type field
    // Use type assertion to tell TypeScript that each item has the shape we expect
    return (data || []).map(item => {
      // First assert the item as unknown, then as our expected type
      const foundItem = item as unknown as FoundItemDB;
      return {
        ...foundItem,
        type: 'found' as const
      };
    });
  };

  // Use React Query to fetch data
  const { 
    data: lostItems = [], 
    isLoading: isLoadingLost 
  } = useQuery({
    queryKey: ["lostItems"],
    queryFn: fetchLostItems,
  });

  const { 
    data: foundItems = [], 
    isLoading: isLoadingFound 
  } = useQuery({
    queryKey: ["foundItems"],
    queryFn: fetchFoundItems,
  });

  const isLoading = isLoadingLost || isLoadingFound;

  // Filter and paginate items
  const filteredItems = useMemo(() => {
    let items: ListingItem[] = [];
    
    // Apply tab filter first
    if (activeTab === "all" || activeTab === "lost") {
      items = [...items, ...lostItems];
    }
    if (activeTab === "all" || activeTab === "found") {
      items = [...items, ...foundItems];
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.item_name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (category !== "All categories") {
      // In a real app, you would have a category field in your database
      // For now, we're just searching in the item name and description
      const categoryQuery = category.toLowerCase();
      items = items.filter(item => 
        item.item_name.toLowerCase().includes(categoryQuery) || 
        item.description.toLowerCase().includes(categoryQuery)
      );
    }

    return items;
  }, [lostItems, foundItems, searchQuery, category, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, category, activeTab]);

  return {
    isLoading,
    filteredItems,
    paginatedItems,
    totalPages,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    selectedItem,
    setSelectedItem,
  };
};
