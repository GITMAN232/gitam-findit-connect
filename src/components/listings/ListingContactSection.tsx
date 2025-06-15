
import React from "react";
import { Mail, Phone, LogIn, AlertTriangle } from "lucide-react";
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

  // Helpers to extract email/phone in a unified way
  const getEmail = (item: ListingObject | null) => {
    if (!item) return "";
    if (item.type === "lost") return (item as any).contact_info || "";
    return (item as any).email || "";
  };

  const getPhone = (item: ListingObject | null) => {
    if (!item) return "";
    if (item.type === "found" && (item as any).phone) {
      return (item as any).phone;
    }
    return "";
  };

  // UI
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
          {/* If NO contact methods: show an explicit warning */}
          {!getEmail(fullItem) && !getPhone(fullItem) ? (
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 p-3 rounded">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <span className="text-yellow-800 text-sm">
                No contact information is available for this report.
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Always show Email if available */}
              {getEmail(fullItem) && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600 break-all">{getEmail(fullItem)}</p>
                  </div>
                </div>
              )}
              {/* Only Found items can have phone numbers */}
              {getPhone(fullItem) && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone Number</p>
                    <p className="text-gray-600">{getPhone(fullItem)}</p>
                  </div>
                </div>
              )}
              {/* If it's a lost item, gently remind about no phone */}
              {fullItem.type === "lost" && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600">
                    <strong>Note:</strong> Only found items may have phone numbers. Please use email for lost item communication.
                  </p>
                </div>
              )}
            </div>
          )}
          {/* Contact Buttons should still appear even if contact info is missing (but they will show warning as well) */}
          <div className="pt-2 border-t border-gray-100">
            <ContactButtons item={fullItem} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ListingContactSection;
