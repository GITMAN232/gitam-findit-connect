
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchUserLostObjects, fetchUserFoundObjects } from "@/services/supabaseApi";
import { ListingObject } from "@/types/ListingTypes";
import EditReportDialog from "@/components/my-reportings/EditReportDialog";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import refactored child components:
import MyAllReportsTab from "@/components/my-reportings/MyAllReportsTab";
import MyLostReportsTab from "@/components/my-reportings/MyLostReportsTab";
import MyFoundReportsTab from "@/components/my-reportings/MyFoundReportsTab";

const MyReportings = () => {
  const [selectedItem, setSelectedItem] = useState<ListingObject | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: lostItems = [], isLoading: isLoadingLost, refetch: refetchLost } = useQuery({
    queryKey: ["userLostObjects"],
    queryFn: fetchUserLostObjects,
  });

  const { data: foundItems = [], isLoading: isLoadingFound, refetch: refetchFound } = useQuery({
    queryKey: ["userFoundObjects"],
    queryFn: fetchUserFoundObjects,
  });

  const isLoading = isLoadingLost || isLoadingFound;

  const handleEdit = (item: ListingObject) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    refetchLost();
    refetchFound();
    setEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteSuccess = () => {
    refetchLost();
    refetchFound();
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-2">
                My Reportings
              </h1>
              <p className="text-gray-600">
                Manage all your reported lost and found items
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button 
                className="bg-maroon hover:bg-maroon/90 text-white"
                onClick={() => navigate("/report-lost")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Lost Item
              </Button>
              <Button 
                className="bg-mustard hover:bg-mustard/90 text-white"
                onClick={() => navigate("/report-found")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Found Item
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Reports ({lostItems.length + foundItems.length})</TabsTrigger>
              <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
              <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  <MyAllReportsTab
                    lostItems={lostItems}
                    foundItems={foundItems}
                    onEdit={handleEdit}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </TabsContent>

                <TabsContent value="lost">
                  <MyLostReportsTab
                    lostItems={lostItems}
                    onEdit={handleEdit}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </TabsContent>

                <TabsContent value="found">
                  <MyFoundReportsTab
                    foundItems={foundItems}
                    onEdit={handleEdit}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>

      <EditReportDialog
        item={selectedItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      <Footer />
    </div>
  );
};

export default MyReportings;
