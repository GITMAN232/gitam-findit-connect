
import React from "react";
import { Button } from "@/components/ui/button";
import MyReportingCard from "./MyReportingCard";
import { ListingObject } from "@/types/ListingTypes";
import { useNavigate } from "react-router-dom";

interface MyAllReportsTabProps {
  lostItems: ListingObject[];
  foundItems: ListingObject[];
  onEdit: (item: ListingObject) => void;
  onDeleteSuccess: () => void;
}

const MyAllReportsTab = ({
  lostItems,
  foundItems,
  onEdit,
  onDeleteSuccess,
}: MyAllReportsTabProps) => {
  const navigate = useNavigate();

  if (lostItems.length === 0 && foundItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Yet</h3>
        <p className="text-gray-500 mb-6">You haven't reported any lost or found items yet.</p>
        <div className="flex gap-4 justify-center">
          <Button
            className="bg-maroon hover:bg-maroon/90"
            onClick={() => navigate("/report-lost")}
          >
            Report Lost Item
          </Button>
          <Button
            className="bg-mustard hover:bg-mustard/90"
            onClick={() => navigate("/report-found")}
          >
            Report Found Item
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...lostItems, ...foundItems]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((item) => (
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

export default MyAllReportsTab;
