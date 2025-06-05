
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PublicListingObject, ListingObject } from "@/types/ListingTypes";
import { getLostObjectDetails, getFoundObjectDetails } from "@/services/supabaseApi";
import { useAuth } from "@/contexts/AuthContext";
import ListingDetailHeader from "./ListingDetailHeader";
import ListingDetailImage from "./ListingDetailImage";
import ListingDetailInfo from "./ListingDetailInfo";
import ListingContactSection from "./ListingContactSection";

interface ListingDetailProps {
  selectedItem: PublicListingObject | null;
  onOpenChange: (open: boolean) => void;
}

const ListingDetail = ({ selectedItem, onOpenChange }: ListingDetailProps) => {
  const [fullItem, setFullItem] = useState<ListingObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasContactError, setHasContactError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!selectedItem || !user) {
        setFullItem(null);
        setHasContactError(false);
        return;
      }

      setIsLoading(true);
      setHasContactError(false);
      
      try {
        const details = selectedItem.type === 'lost' 
          ? await getLostObjectDetails(selectedItem.id)
          : await getFoundObjectDetails(selectedItem.id);
        setFullItem(details);
      } catch (error) {
        console.error('Error fetching full details:', error);
        setFullItem(null);
        setHasContactError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullDetails();
  }, [selectedItem, user]);

  if (!selectedItem) return null;

  const displayItem = fullItem || selectedItem;

  return (
    <Dialog open={!!selectedItem} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
        <ListingDetailHeader selectedItem={selectedItem} />
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <ListingDetailImage selectedItem={selectedItem} />
          
          <div className="space-y-6">
            <ListingDetailInfo 
              selectedItem={selectedItem} 
              displayItem={displayItem} 
            />
            
            <ListingContactSection
              user={user}
              isLoading={isLoading}
              hasContactError={hasContactError}
              fullItem={fullItem}
              onOpenChange={onOpenChange}
            />
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                {user 
                  ? "Please contact the reporter if you have information about this object. Be prepared to provide identifying details to verify ownership."
                  : "Contact information is only visible to logged-in users to prevent spam and protect privacy."
                }
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListingDetail;
