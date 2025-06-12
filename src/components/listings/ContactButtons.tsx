
import React from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingObject } from "@/types/ListingTypes";

interface ContactButtonsProps {
  item: ListingObject;
}

const ContactButtons = ({ item }: ContactButtonsProps) => {
  console.log('ContactButtons - item:', item);
  console.log('ContactButtons - item type:', item.type);
  
  const handleWhatsAppClick = () => {
    // Only found items have phone numbers in our current database structure
    const phone = item.type === 'found' ? (item as any).phone : null;
    console.log('WhatsApp click - phone:', phone);
    
    if (!phone) {
      console.log('No phone number available for this item type');
      return;
    }
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    const message = `Hi, I saw your report for "${item.object_name}" on the GITAM Lost & Found portal. Can we connect?`;
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const email = item.type === 'lost' ? (item as any).contact_info : (item as any).email;
    if (!email) return;
    
    const subject = `Regarding your ${item.type} item: ${item.object_name}`;
    const body = `Hi, I saw your listing for "${item.object_name}" on G-Lost&Found and would like to connect.`;
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  // Check for available contact methods
  // Only found items have phone numbers in current database structure
  const hasWhatsApp = item.type === 'found' && !!(item as any).phone;
  const hasEmail = item.type === 'lost' ? !!(item as any).contact_info : !!(item as any).email;
  
  console.log('ContactButtons - hasWhatsApp:', hasWhatsApp);
  console.log('ContactButtons - hasEmail:', hasEmail);
  console.log('ContactButtons - phone value (found items only):', item.type === 'found' ? (item as any).phone : 'N/A for lost items');
  console.log('ContactButtons - email value:', item.type === 'lost' ? (item as any).contact_info : (item as any).email);

  if (!hasEmail && !hasWhatsApp) {
    console.log('No contact methods available');
    return (
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 mb-2">Quick Contact</h4>
        <p className="text-sm text-gray-500">No contact information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-gray-700 mb-2">Quick Contact</h4>
      <div className="flex flex-col gap-2">
        {hasEmail && (
          <Button
            onClick={handleEmailClick}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        )}
        
        {hasWhatsApp && (
          <Button
            onClick={handleWhatsAppClick}
            variant="outline"
            size="sm"
            className="w-full justify-start text-left bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContactButtons;
