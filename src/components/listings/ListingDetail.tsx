
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Mail, Phone, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PublicListingObject, ListingObject } from "@/types/ListingTypes";
import { getLostObjectDetails, getFoundObjectDetails } from "@/services/supabaseApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ContactButtons from "./ContactButtons";

interface ListingDetailProps {
  selectedItem: PublicListingObject | null;
  onOpenChange: (open: boolean) => void;
}

const ListingDetail = ({ selectedItem, onOpenChange }: ListingDetailProps) => {
  const [fullItem, setFullItem] = useState<ListingObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasContactError, setHasContactError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!selectedItem) {
        setFullItem(null);
        setHasContactError(false);
        return;
      }

      if (!user) {
        setFullItem(null);
        setHasContactError(false);
        return;
      }

      setIsLoading(true);
      setHasContactError(false);
      try {
        let details;
        if (selectedItem.type === 'lost') {
          details = await getLostObjectDetails(selectedItem.id);
        } else {
          details = await getFoundObjectDetails(selectedItem.id);
        }
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

  const handleLoginRedirect = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  if (!selectedItem) return null;

  // Use full item details if available and user is authenticated, otherwise use public item
  const displayItem = fullItem || selectedItem;

  // Render date based on item type
  const renderDate = (item: PublicListingObject | ListingObject) => {
    if (item.type === 'lost') {
      return format(new Date((item as any).lost_date), "PPP");
    } else {
      return format(new Date((item as any).found_date), "PPP");
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
            {selectedItem.object_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
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
            </div>
            
            {/* Contact Information Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              
              {!user ? (
                <div className="bg-gradient-to-r from-maroon/10 to-mustard/10 p-4 rounded-lg border border-maroon/20">
                  <div className="flex items-start gap-3 mb-3">
                    <LogIn className="h-5 w-5 text-maroon mt-0.5" />
                    <div>
                      <p className="font-medium text-maroon">Login Required</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Please log in to view contact information and get in touch with the reporter.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleLoginRedirect}
                    className="w-full bg-maroon hover:bg-maroon/90"
                  >
                    Login to View Contact Info
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon"></div>
                  <span className="ml-2 text-gray-600">Loading contact information...</span>
                </div>
              ) : hasContactError ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600">
                    Unable to load contact information. Please try again later.
                  </p>
                </div>
              ) : fullItem ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {fullItem.type === "lost" ? (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p className="text-gray-600">{(fullItem as any).contact_info}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-gray-600">{(fullItem as any).email}</p>
                          </div>
                        </div>
                        
                        {(fullItem as any).phone && (
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-medium">WhatsApp</p>
                              <p className="text-gray-600">{(fullItem as any).phone}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Contact Buttons */}
                  <div className="pt-2 border-t border-gray-100">
                    <ContactButtons item={fullItem} />
                  </div>
                </div>
              ) : null}
            </div>
            
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
