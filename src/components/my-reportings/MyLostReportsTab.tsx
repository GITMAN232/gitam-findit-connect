
import React from "react";
import { Button } from "@/components/ui/button";
import MyReportingCard from "./MyReportingCard";
import { ListingObject } from "@/types/ListingTypes";
import { useNavigate } from "react-router-dom";

interface MyLostReportsTabProps {
  lostItems: ListingObject[];
  onEdit: (item: ListingObject) => void;
  onDeleteSuccess: () => void;
}

const MyLostReportsTab = ({
  lostItems,
  onEdit,
  onDeleteSuccess,
}: MyLostReportsTabProps) => {
  const navigate = useNavigate();

  if (lostItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lost Items Reported</h3>
        <p className="text-gray-500 mb-6">You haven't reported any lost items yet.</p>
        <Button
          className="bg-maroon hover:bg-maroon/90"
          onClick={() => navigate("/report-lost")}
        >
          Report Lost Item
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lostItems.map((item) => (
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

export default MyLostReportsTab;
