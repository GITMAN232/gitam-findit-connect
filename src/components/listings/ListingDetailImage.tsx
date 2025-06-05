
import React from "react";
import { PublicListingObject } from "@/types/ListingTypes";

interface ListingDetailImageProps {
  selectedItem: PublicListingObject;
}

const ListingDetailImage = ({ selectedItem }: ListingDetailImageProps) => {
  return (
    <div>
      <div className="bg-gray-100 rounded-md overflow-hidden h-60 md:h-80 mb-4 flex items-center justify-center">
        {selectedItem.image_url ? (
          <img
            src={selectedItem.image_url}
            alt={selectedItem.object_name}
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
  );
};

export default ListingDetailImage;
