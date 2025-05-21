
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories } from "@/types/ListingTypes";

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FilterControls = ({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  activeTab,
  setActiveTab,
}: FilterControlsProps) => {
  return (
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
  );
};

export default FilterControls;
