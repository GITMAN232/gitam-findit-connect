import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { campuses } from "@/types/ListingTypes";

interface CampusSelectorProps {
  isOpen: boolean;
  onSelect: (campus: string) => void;
  onOpenChange: (open: boolean) => void;
  defaultCampus?: string | null;
}

const CampusSelector = ({ isOpen, onSelect, onOpenChange, defaultCampus }: CampusSelectorProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-maroon">
            Select Your Campus
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Choose your campus to view relevant lost and found items
          </p>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          {defaultCampus && (
            <div className="text-center text-sm text-gray-600 mb-3">
              Last selected: <span className="font-medium text-maroon">{defaultCampus}</span>
            </div>
          )}
          {campuses.map((campus) => (
            <Button
              key={campus}
              onClick={() => onSelect(campus)}
              className={`w-full py-4 text-lg font-medium border-2 transition-all duration-200 ${
                campus === defaultCampus
                  ? "bg-maroon/10 border-maroon text-maroon hover:bg-maroon/20"
                  : "bg-white border-gray-200 text-gray-800 hover:border-maroon hover:bg-maroon/5"
              }`}
              variant="outline"
            >
              <span className="mr-3 text-xl">🏫</span>
              {campus}
              {campus === defaultCampus && (
                <span className="ml-2 text-xs bg-maroon text-white px-2 py-1 rounded-full">
                  Previous
                </span>
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampusSelector;