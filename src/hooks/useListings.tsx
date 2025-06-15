
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PublicListingObject } from "@/types/ListingTypes";
import { fetchLostObjects, fetchFoundObjects } from "@/services/supabaseApi";

export const PAGE_SIZE = 8;

export const useListings = (searchQuery: string, category: string, activeTab: string) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<PublicListingObject | null>(null);

  // Use React Query to fetch data from Supabase public views
  const { 
    data: lostItems = [], 
    isLoading: isLoadingLost 
  } = useQuery({
    queryKey: ["lostObjects"],
    queryFn: fetchLostObjects,
  });

  const { 
    data: foundItems = [], 
    isLoading: isLoadingFound 
  } = useQuery({
    queryKey: ["foundObjects"],
    queryFn: fetchFoundObjects,
  });

  const isLoading = isLoadingLost || isLoadingFound;

  // Filter and paginate items
  const filteredItems = useMemo(() => {
    let items: PublicListingObject[] = [];
    
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
        item.object_name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (category !== "All categories") {
      const categoryQuery = category.toLowerCase();
      items = items.filter(item => 
        item.object_name.toLowerCase().includes(categoryQuery) || 
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

  // Reset page when filters change (useEffect instead of useMemo)
  useEffect(() => {
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
