
import React from "react";
import { Mail, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingObject } from "@/types/ListingTypes";

interface ContactButtonsProps {
  item: ListingObject;
}

// Helpers for robust checks
const getEmail = (item: ListingObject) => {
  if (!item) return "";
  return item.type === "lost"
    ? (item as any).contact_info || ""
    : (item as any).email || "";
};
const getPhone = (item: ListingObject) => {
  if (!item) return "";
  if (item.type === "found") return (item as any).phone || "";
  return "";
};

const ContactButtons = ({ item }: ContactButtonsProps) => {
  const email = getEmail(item);
  const phone = getPhone(item);

  const handleWhatsAppClick = () => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const message = `Hi, I saw your report for "${item.object_name}" on the GITAM Lost & Found portal. Can we connect?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailClick = () => {
    if (!email) return;
    const subject = `Regarding your ${item.type} item: ${item.object_name}`;
    const body = `Hi, I saw your listing for "${item.object_name}" on G-Lost&Found and would like to connect.`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  // Availability of methods
  const hasEmail = !!email;
  const hasWhatsApp = !!phone;

  if (!hasEmail && !hasWhatsApp) {
    return (
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 mb-2">Quick Contact</h4>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded p-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-800">No contact methods available.</span>
        </div>
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
