
import React from "react";

interface EmptyStateProps {
  searchQuery: string;
  category: string;
}

const EmptyState = ({ searchQuery, category }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 text-gray-500">
      <div className="text-6xl mb-4">🔎</div>
      <h3 className="text-2xl font-medium mb-2">No items found</h3>
      <p>
        {searchQuery || category !== "All categories"
          ? "Try changing your search filters"
          : "No items have been reported yet"}
      </p>
    </div>
  );
};

export default EmptyState;
