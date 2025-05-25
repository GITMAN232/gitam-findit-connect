
import React from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ListingObject } from "@/types/ListingTypes";

interface ListingCardProps {
  item: ListingObject;
  onClick: () => void;
}

const ListingCard = ({ item, onClick }: ListingCardProps) => {
  // Render date based on item type
  const renderDate = (item: ListingObject) => {
    if (item.type === 'lost') {
      return format(new Date(item.lost_date), "PPP");
    } else {
      return format(new Date(item.found_date), "PPP");
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
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
            alt={item.object_name}
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
        <h3 className="text-lg font-semibold line-clamp-1">{item.object_name}</h3>
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
  );
};

export default ListingCard;
