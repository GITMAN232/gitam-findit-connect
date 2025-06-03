
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchUserLostObjects, fetchUserFoundObjects } from "@/services/supabaseApi";
import { ListingObject } from "@/types/ListingTypes";
import MyReportingCard from "@/components/my-reportings/MyReportingCard";
import EditReportDialog from "@/components/my-reportings/EditReportDialog";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
                  {lostItems.length === 0 && foundItems.length === 0 ? (
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
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...lostItems, ...foundItems]
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((item) => (
                          <MyReportingCard
                            key={`${item.type}-${item.id}`}
                            item={item}
                            onEdit={handleEdit}
                            onDeleteSuccess={handleDeleteSuccess}
                          />
                        ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="lost">
                  {lostItems.length === 0 ? (
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
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lostItems.map((item) => (
                        <MyReportingCard
                          key={`${item.type}-${item.id}`}
                          item={item}
                          onEdit={handleEdit}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="found">
                  {foundItems.length === 0 ? (
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
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {foundItems.map((item) => (
                        <MyReportingCard
                          key={`${item.type}-${item.id}`}
                          item={item}
                          onEdit={handleEdit}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      ))}
                    </div>
                  )}
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
