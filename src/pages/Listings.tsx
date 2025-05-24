
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/listings/ListingCard";
import ListingDetail from "@/components/listings/ListingDetail";
import FilterControls from "@/components/listings/FilterControls";
import PaginationControls from "@/components/listings/PaginationControls";
import EmptyState from "@/components/listings/EmptyState";
import { useListings } from "@/hooks/useListings";

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [activeTab, setActiveTab] = useState("all");
  
  const {
    isLoading,
    paginatedItems,
    totalPages,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    selectedItem,
    setSelectedItem,
  } = useListings(searchQuery, category, activeTab);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-2">
                Lost & Found Objects
              </h1>
              <p className="text-gray-600">
                Browse through all reported lost and found objects on campus
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button 
                variant="outline" 
                className="bg-maroon/10 hover:bg-maroon/20 text-maroon border-maroon"
                onClick={() => window.location.href="/report-lost"}
              >
                Report Lost Object
              </Button>
              <Button 
                variant="outline" 
                className="bg-mustard/10 hover:bg-mustard/20 text-mustard border-mustard"
                onClick={() => window.location.href="/report-found"}
              >
                Report Found Object
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
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
            </div>
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
