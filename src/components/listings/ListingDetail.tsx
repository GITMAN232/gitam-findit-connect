
import React from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListingItem } from "@/types/ListingTypes";

interface ListingDetailProps {
  selectedItem: ListingItem | null;
  onOpenChange: (open: boolean) => void;
}

const ListingDetail = ({ selectedItem, onOpenChange }: ListingDetailProps) => {
  if (!selectedItem) return null;

  // Render date based on item type
  const renderDate = (item: ListingItem) => {
    if (item.type === 'lost') {
      return format(new Date(item.lost_date), "PPP");
    } else {
      return format(new Date(item.found_date), "PPP");
    }
  };

  return (
    <Dialog open={!!selectedItem} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
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
      </DialogContent>
    </Dialog>
  );
};

export default ListingDetail;
