
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  ArrowLeft,
  ArrowRight,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/contexts/AuthContext";

// Define base types for our database items
interface BaseItem {
  id: number;
  created_at: string;
  user_id: string;
  item_name: string;
  description: string;
  location: string;
  image_url: string | null;
  status: string;
}

// Types for our listings
interface LostItem extends BaseItem {
  lost_date: string;
  contact_info: string;
  type: 'lost';
}

interface FoundItem extends BaseItem {
  found_date: string;
  email: string;
  phone: string | null;
  type: 'found';
}

type ListingItem = LostItem | FoundItem;

// Database response types (without the type field)
interface LostItemDB extends Omit<LostItem, 'type'> {}
interface FoundItemDB extends Omit<FoundItem, 'type'> {}

// Categories for filtering
const categories = [
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

const PAGE_SIZE = 8;

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);

  // Fetch lost items with proper type handling
  const fetchLostItems = async (): Promise<LostItem[]> => {
    const { data, error } = await supabase
      .from("lost_items")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    // Add type field to each item to match the LostItem interface
    return data.map(item => ({
      ...item, 
      type: 'lost' as const
    })) as LostItem[];
  };

  // Fetch found items with proper type handling
  const fetchFoundItems = async (): Promise<FoundItem[]> => {
    const { data, error } = await supabase
      .from("found_items")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    // Add type field to each item to match the FoundItem interface
    return data.map(item => ({
      ...item, 
      type: 'found' as const
    })) as FoundItem[];
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
  const filteredItems = React.useMemo(() => {
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

  // Render date based on item type
  const renderDate = (item: ListingItem) => {
    if (item.type === 'lost') {
      return format(new Date(item.lost_date), "PPP");
    } else {
      return format(new Date(item.found_date), "PPP");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-2">
                Lost & Found Items
              </h1>
              <p className="text-gray-600">
                Browse through all reported lost and found items on campus
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button 
                variant="outline" 
                className="bg-maroon/10 hover:bg-maroon/20 text-maroon border-maroon"
                onClick={() => window.location.href="/report-lost"}
              >
                Report Lost Item
              </Button>
              <Button 
                variant="outline" 
                className="bg-mustard/10 hover:bg-mustard/20 text-mustard border-mustard"
                onClick={() => window.location.href="/report-found"}
              >
                Report Found Item
              </Button>
            </div>
          </div>

          {/* Filtering options */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search items..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter size={18} className="mr-2" />
                      <SelectValue placeholder="All categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="lost">Lost Items</TabsTrigger>
                <TabsTrigger value="found">Found Items</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
            </div>
          ) : (
            <>
              {paginatedItems.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-6xl mb-4">🔎</div>
                  <h3 className="text-2xl font-medium mb-2">No items found</h3>
                  <p>
                    {searchQuery || category !== "All categories"
                      ? "Try changing your search filters"
                      : "No items have been reported yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {paginatedItems.map((item) => (
                    <Card 
                      key={`${item.type}-${item.id}`} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="h-48 bg-gray-100 relative">
                        <Badge
                          className={`absolute top-3 left-3 ${
                            item.type === "lost"
                              ? "bg-maroon hover:bg-maroon/80"
                              : "bg-mustard hover:bg-mustard/80"
                          }`}
                        >
                          {item.type === "lost" ? "Lost" : "Found"}
                        </Badge>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.item_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-3xl text-gray-400">📦</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold line-clamp-1">{item.item_name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                      </CardContent>
                      <CardFooter className="px-4 pb-4 pt-0 flex-col items-start">
                        <div className="w-full space-y-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{renderDate(item)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{format(new Date(item.created_at), "PP")}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Badge
                    className={`${
                      selectedItem.type === "lost"
                        ? "bg-maroon hover:bg-maroon/80"
                        : "bg-mustard hover:bg-mustard/80"
                    }`}
                  >
                    {selectedItem.type === "lost" ? "Lost" : "Found"}
                  </Badge>
                  {selectedItem.item_name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <div className="bg-gray-100 rounded-md overflow-hidden h-60 md:h-80 mb-4 flex items-center justify-center">
                    {selectedItem.image_url ? (
                      <img
                        src={selectedItem.image_url}
                        alt={selectedItem.item_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-6xl">📦</div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-gray-600">{selectedItem.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {selectedItem.type === "lost" ? "Date Lost" : "Date Found"}
                          </p>
                          <p className="text-gray-600">{renderDate(selectedItem)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Reported On</p>
                          <p className="text-gray-600">
                            {format(new Date(selectedItem.created_at), "PPpp")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      {selectedItem.type === "lost" ? (
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Contact</p>
                            <p className="text-gray-600">{selectedItem.contact_info}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-gray-600">{selectedItem.email}</p>
                            </div>
                          </div>
                          
                          {selectedItem.phone && (
                            <div className="flex items-start gap-3">
                              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                              <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-gray-600">{selectedItem.phone}</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">
                      Please contact the reporter if you have information about this item.
                      Be prepared to provide identifying details to verify ownership.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Listings;
