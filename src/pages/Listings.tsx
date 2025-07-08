import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/listings/ListingCard";
import ListingDetail from "@/components/listings/ListingDetail";
import FilterControls from "@/components/listings/FilterControls";
import PaginationControls from "@/components/listings/PaginationControls";
import EmptyState from "@/components/listings/EmptyState";
import { useListings } from "@/hooks/useListings";
import { Skeleton } from "@/components/ui/skeleton";
import CampusSelector from "@/components/CampusSelector";

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCampus, setSelectedCampus] = useState<string | null>(
    sessionStorage.getItem("selectedCampus")
  );
  const [showCampusSelector, setShowCampusSelector] = useState(!selectedCampus);
  
  const {
    isLoading,
    paginatedItems,
    totalPages,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    selectedItem,
    setSelectedItem,
  } = useListings(searchQuery, category, activeTab, selectedCampus || undefined);

  // Helper to render loading skeletons (same count as grid cards)
  const SkeletonGrid = () => {
    const skeletonArr = Array.from({ length: 8 }); // for 8 cards on lg, fallback for lower grid as well
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {skeletonArr.map((_, idx) => (
          <div className="rounded-xl bg-white border p-5 flex flex-col gap-4 shadow animate-pulse" key={idx}>
            <Skeleton className="w-full h-40 rounded-lg" />
            <Skeleton className="h-6 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Handle campus selection
  const handleCampusSelect = (campus: string) => {
    setSelectedCampus(campus);
    sessionStorage.setItem("selectedCampus", campus);
    setShowCampusSelector(false);
  };

  // Fix scroll behavior - scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-2">
                Lost & Found Objects
                {selectedCampus && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    - {selectedCampus} Campus
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground">
                Browse through all reported lost and found objects on campus
              </p>
              {selectedCampus && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCampusSelector(true)}
                  className="mt-2 text-xs"
                >
                  Change Campus
                </Button>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button 
                variant="outline" 
                className="bg-maroon/10 hover:bg-maroon/20 text-maroon border-maroon"
                asChild
              >
                <Link to="/report-lost">Report Lost Object</Link>
              </Button>
              <Button 
                variant="outline" 
                className="bg-mustard/10 hover:bg-mustard/20 text-mustard border-mustard"
                asChild
              >
                <Link to="/report-found">Report Found Object</Link>
              </Button>
            </div>
          </div>

          {/* Filtering options */}
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={category}
            setCategory={setCategory}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {isLoading ? (
            <SkeletonGrid />
          ) : (
            <>
              {paginatedItems.length === 0 ? (
                <EmptyState searchQuery={searchQuery} category={category} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {paginatedItems.map((object) => (
                    <ListingCard
                      key={`${object.type}-${object.id}`}
                      item={object}
                      onClick={() => setSelectedItem(object)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination controls */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Campus Selection Dialog */}
      <CampusSelector
        isOpen={showCampusSelector}
        onSelect={handleCampusSelect}
        onOpenChange={setShowCampusSelector}
      />

      {/* Object Detail Dialog */}
      <ListingDetail
        selectedItem={selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
      
      <Footer />
    </div>
  );
};

export default Listings;
