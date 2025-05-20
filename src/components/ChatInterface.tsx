
import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  reportId: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

export const ChatInterface = ({ reportId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "This chat will be available after you submit the report. The person who lost this item can contact you anonymously.",
      sender: "other",
      timestamp: new Date(),
    },
  ]);
  
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add the user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate a response (in a real app, this would come from a backend)
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        text: "This is a demo of the chat interface. In a real app, messages would be stored and delivered to the appropriate user.",
        sender: "other",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md">
      <div className="bg-gray-100 p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-mustard" />
          <h4 className="font-medium">Anonymous Chat</h4>
        </div>
        <span className="text-xs text-gray-500">ID: {reportId.substring(0, 8)}</span>
      </div>
      
      <div className="h-60 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "max-w-[80%] p-3 rounded-lg",
              message.sender === "user" 
                ? "bg-mustard/10 ml-auto rounded-tr-none" 
                : "bg-gray-200 mr-auto rounded-tl-none"
            )}
          >
            <p className="text-sm">{message.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          className="bg-mustard hover:bg-mustard/90"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};
