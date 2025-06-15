
import React from "react";
import { Button } from "@/components/ui/button";
import MyReportingCard from "./MyReportingCard";
import { ListingObject } from "@/types/ListingTypes";
import { useNavigate } from "react-router-dom";

interface MyFoundReportsTabProps {
  foundItems: ListingObject[];
  onEdit: (item: ListingObject) => void;
  onDeleteSuccess: () => void;
}

const MyFoundReportsTab = ({
  foundItems,
  onEdit,
  onDeleteSuccess,
}: MyFoundReportsTabProps) => {
  const navigate = useNavigate();

  if (foundItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Found Items Reported</h3>
        <p className="text-gray-500 mb-6">You haven't reported any found items yet.</p>
        <Button
          className="bg-mustard hover:bg-mustard/90"
          onClick={() => navigate("/report-found")}
        >
          Report Found Item
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foundItems.map((item) => (
        <MyReportingCard
          key={`${item.type}-${item.id}`}
          item={item}
          onEdit={onEdit}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
};

export default MyFoundReportsTab;
