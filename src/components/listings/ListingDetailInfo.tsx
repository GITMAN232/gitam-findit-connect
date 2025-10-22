import React, { useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Flag } from "lucide-react";
import { PublicListingObject, ListingObject } from "@/types/ListingTypes";
import { Button } from "@/components/ui/button";
import { ClaimModal } from "./ClaimModal";
import { useAuth } from "@/contexts/AuthContext";

interface ListingDetailInfoProps {
  selectedItem: PublicListingObject;
  displayItem: PublicListingObject | ListingObject;
}

const ListingDetailInfo = ({ selectedItem, displayItem }: ListingDetailInfoProps) => {
  const { user } = useAuth();
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const renderDate = (item: PublicListingObject | ListingObject) => {
    if (item.type === 'lost') {
      return format(new Date((item as any).lost_date), "PPP");
    } else {
      return format(new Date((item as any).found_date), "PPP");
    }
  };

  return (
    <>
      <ClaimModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        itemId={selectedItem.id}
        itemType={selectedItem.type}
        itemName={selectedItem.object_name}
      />
      
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
              <p className="text-gray-600">{renderDate(displayItem)}</p>
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

        {user && selectedItem.type === 'found' && (
          <Button 
            onClick={() => setClaimModalOpen(true)}
            className="w-full mt-6"
            size="lg"
          >
            <Flag className="h-4 w-4 mr-2" />
            Claim This Item
          </Button>
        )}
      </div>
    </>
  );
};

export default ListingDetailInfo;
