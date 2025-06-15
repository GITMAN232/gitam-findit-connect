
import React, { useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Image, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PublicListingObject } from "@/types/ListingTypes";
import { Skeleton } from "@/components/ui/skeleton";

interface ListingCardProps {
  item: PublicListingObject;
  onClick: () => void;
}

const ListingCard = ({ item, onClick }: ListingCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Render date based on item type
  const renderDate = (item: PublicListingObject) => {
    if (item.type === "lost") {
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
      <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
        <Badge
          className={`absolute top-3 left-3 ${
            item.type === "lost"
              ? "bg-maroon hover:bg-maroon/80"
              : "bg-mustard hover:bg-mustard/80"
          }`}
        >
          {item.type === "lost" ? "Lost" : "Found"}
        </Badge>
        {item.image_url && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100">
                <Skeleton className="w-full h-full" />
                <Image className="w-8 h-8 text-gray-300 absolute" />
              </div>
            )}
            <img
              src={item.image_url}
              alt={item.object_name}
              loading="lazy"
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              fetchPriority="low"
            />
          </>
        ) : imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 flex-col">
            <ImageOff className="w-10 h-10 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Image not available</span>
          </div>
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
