
import React, { useState, useEffect } from "react";
import { PublicListingObject } from "@/types/ListingTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, ImageOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ListingDetailImageProps {
  selectedItem: PublicListingObject;
}

const ListingDetailImage = ({ selectedItem }: ListingDetailImageProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Reset state on change of item/image
    setImgLoaded(false);
    setImgError(false);
  }, [selectedItem.image_url, selectedItem.id]);

  useEffect(() => {
    if (imgError && selectedItem?.object_name) {
      toast({
        title: "Image failed to load",
        description: `We couldn't load the image for "${selectedItem.object_name}". Showing a fallback.`,
        variant: "destructive",
      });
    }
  }, [imgError, selectedItem]);

  return (
    <div>
      <div className="bg-gray-100 rounded-md overflow-hidden h-60 md:h-80 mb-4 flex items-center justify-center relative animate-fade-in">
        {selectedItem.image_url && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-100/80 animate-fade-in">
                <Skeleton className="w-full h-full" />
                <Image className="w-10 h-10 text-gray-300 absolute animate-pulse" />
                <span className="text-xs text-gray-400 mt-16 animate-fade-in">
                  Loading image...
                </span>
              </div>
            )}
            <img
              src={selectedItem.image_url}
              alt={selectedItem.object_name}
              className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              fetchPriority="high"
            />
          </>
        ) : imgError ? (
          <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in">
            <ImageOff className="w-14 h-14 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Image not available</span>
          </div>
        ) : (
          <div className="text-6xl animate-fade-in">📦</div>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">Description</h3>
        <p className="text-gray-700">{selectedItem.description}</p>
      </div>
    </div>
  );
};

export default ListingDetailImage;

