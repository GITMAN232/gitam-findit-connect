
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousPage}
        disabled={currentPage === 1}
      >
        <ArrowLeft size={16} />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      >
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default PaginationControls;
