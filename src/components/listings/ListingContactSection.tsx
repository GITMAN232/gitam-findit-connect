
import React from "react";
import { Mail, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingObject } from "@/types/ListingTypes";
import { useNavigate } from "react-router-dom";
import ContactButtons from "./ContactButtons";

interface ListingContactSectionProps {
  user: any;
  isLoading: boolean;
  hasContactError: boolean;
  fullItem: ListingObject | null;
  onOpenChange: (open: boolean) => void;
}

const ListingContactSection = ({
  user,
  isLoading,
  hasContactError,
  fullItem,
  onOpenChange,
}: ListingContactSectionProps) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
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
              <>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{(fullItem as any).contact_info}</p>
                  </div>
                </div>
                
                {(fullItem as any).phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-gray-600">{(fullItem as any).phone}</p>
                    </div>
                  </div>
                )}
              </>
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
                      <p className="font-medium">Phone Number</p>
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
  );
};

export default ListingContactSection;
