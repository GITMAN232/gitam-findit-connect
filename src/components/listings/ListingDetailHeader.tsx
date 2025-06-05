
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PublicListingObject } from "@/types/ListingTypes";

interface ListingDetailHeaderProps {
  selectedItem: PublicListingObject;
}

const ListingDetailHeader = ({ selectedItem }: ListingDetailHeaderProps) => {
  return (
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
        {selectedItem.object_name}
      </DialogTitle>
    </DialogHeader>
  );
};

export default ListingDetailHeader;
