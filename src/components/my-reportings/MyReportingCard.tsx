
import React, { useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Edit, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ListingObject } from "@/types/ListingTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MyReportingCardProps {
  item: ListingObject;
  onEdit: (item: ListingObject) => void;
  onDeleteSuccess: () => void;
}

const MyReportingCard = ({ item, onEdit, onDeleteSuccess }: MyReportingCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const tableName = item.type === 'lost' ? 'lost_objects' : 'found_objects';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Report deleted",
        description: `Your ${item.type} item report has been deleted successfully.`,
      });
      onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderDate = (item: ListingObject) => {
    if (item.type === 'lost') {
      return format(new Date((item as any).lost_date), "PPP");
    } else {
      return format(new Date((item as any).found_date), "PPP");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-100 relative">
        <Badge
          className={`absolute top-3 left-3 ${
            item.type === "lost"
              ? "bg-maroon hover:bg-maroon/80"
              : "bg-mustard hover:bg-mustard/80"
          }`}
        >
          {item.type === "lost" ? "Lost" : "Found"}
        </Badge>
        <Badge
          variant={
            item.status === 'approved' ? 'default' : 
            item.status === 'rejected' ? 'destructive' : 
            item.status === 'claimed' ? 'secondary' :
            item.status === 'pending' ? 'outline' :
            'secondary'
          }
          className="absolute top-3 right-3 capitalize"
        >
          {item.status || 'pending'}
        </Badge>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.object_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl text-gray-400">📦</span>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 mb-2">{item.object_name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
        
        <div className="space-y-1 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{renderDate(item)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Reported {format(new Date(item.created_at), "PP")}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(item)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Delete Report
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {item.type} item report for "{item.object_name}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MyReportingCard;
