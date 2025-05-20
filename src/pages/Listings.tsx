
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data - in a real app, this would come from an API
const mockItems = [
  {
    id: 1,
    title: "iPhone 14 Pro",
    type: "Lost",
    category: "Electronics",
    location: "Engineering Block",
    date: "2025-05-15",
    description: "Black iPhone 14 Pro with a clear case. Last seen in the Engineering Block.",
    contactEmail: "john@example.com",
    thumbnail: null,
  },
  {
    id: 2,
    title: "Blue Backpack",
    type: "Found",
    category: "Bags",
    location: "Main Library",
    date: "2025-05-18",
    description: "Found a blue Jansport backpack with laptop and notebooks inside.",
    contactEmail: "library@gitam.edu",
    thumbnail: null,
  },
  {
    id: 3,
    title: "Student ID Card",
    type: "Found",
    category: "Documents",
    location: "Cafeteria",
    date: "2025-05-17",
    description: "Student ID card under the name of Priya Sharma.",
    contactEmail: "cafeteria@gitam.edu",
    thumbnail: null,
  },
  {
    id: 4,
    title: "Black Wallet",
    type: "Lost",
    category: "Accessories",
    location: "Sports Complex",
    date: "2025-05-16",
    description: "Black leather wallet with ID, credit cards and some cash.",
    contactEmail: "mike@example.com",
    thumbnail: null,
  },
  {
    id: 5,
    title: "Prescription Glasses",
    type: "Lost",
    category: "Accessories",
    location: "Science Building",
    date: "2025-05-14",
    description: "Black-framed prescription glasses in a blue case.",
    contactEmail: "sarah@example.com",
    thumbnail: null,
  },
  {
    id: 6,
    title: "Water Bottle",
    type: "Found",
    category: "Others",
    location: "Gymnasium",
    date: "2025-05-19",
    description: "Found a Hydro Flask water bottle, dark blue color.",
    contactEmail: "gym@gitam.edu",
    thumbnail: null,
  },
];

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("type") || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter items based on active tab, search query and category
  const filteredItems = mockItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
    
    return matchesTab && matchesSearch && matchesCategory;
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    updateSearchParams(value, searchQuery, selectedCategory);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateSearchParams(activeTab, searchQuery, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    updateSearchParams(activeTab, searchQuery, value);
  };

  // Update search parameters
  const updateSearchParams = (type: string, query: string, category: string) => {
    const params: { type?: string; q?: string; category?: string } = {};
    if (type !== "all") params.type = type;
    if (query) params.q = query;
    if (category) params.category = category;
    setSearchParams(params);
  };

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Categories from items
  const categories = [...new Set(mockItems.map((item) => item.category))];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-4">
              Lost & Found Listings
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Browse through the lost and found items reported on campus. 
              Filter by type, search by keywords, or filter by category.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={handleTabChange}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="lost">Lost Items</TabsTrigger>
                <TabsTrigger value="found">Found Items</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form onSubmit={handleSearch} className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="search" 
                  placeholder="Search items..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </form>

              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </p>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover-card">
                    <div className="h-48 bg-grey/20 relative">
                      <Badge 
                        className={`absolute top-3 left-3 ${
                          item.type === "Lost" ? "bg-maroon/10 text-maroon" : "bg-mustard/20 text-mustard"
                        }`}
                      >
                        {item.type}
                      </Badge>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-grey/30 flex items-center justify-center">
                          <span className="text-4xl text-grey">📦</span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex flex-col gap-2 text-sm text-gray-600 mt-2">
                        <p className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.location}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(item.date)}
                        </p>
                      </div>
                      <p className="mt-3 text-sm text-gray-700 line-clamp-2">{item.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full" variant="outline">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No items found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Listings;
