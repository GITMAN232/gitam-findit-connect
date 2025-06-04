
import React from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingObject } from "@/types/ListingTypes";

interface ContactButtonsProps {
  item: ListingObject;
}

const ContactButtons = ({ item }: ContactButtonsProps) => {
  const handleWhatsAppClick = () => {
    const phone = item.type === 'found' ? (item as any).phone : null;
    if (!phone) return;
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    const message = `Hey, I saw your listing for the ${item.type} item "${item.object_name}". I may have information about it.`;
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    const email = item.type === 'lost' ? (item as any).contact_info : (item as any).email;
    if (!email) return;
    
    const subject = `Regarding your ${item.type} item: ${item.object_name}`;
    const body = `Hi, I saw your listing for "${item.object_name}" on FindIt GITAM and would like to connect.`;
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const hasWhatsApp = item.type === 'found' && (item as any).phone;
  const hasEmail = item.type === 'lost' ? (item as any).contact_info : (item as any).email;

  if (!hasEmail && !hasWhatsApp) {
    return null;
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
