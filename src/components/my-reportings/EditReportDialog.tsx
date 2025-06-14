
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ListingObject } from "@/types/ListingTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/services/supabaseApi";

interface EditReportDialogProps {
  item: ListingObject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const lostObjectSchema = z.object({
  object_name: z.string().min(1, "Object name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  lost_date: z.string().min(1, "Lost date is required"),
  contact_info: z.string().min(1, "Contact information is required"),
});

const foundObjectSchema = z.object({
  object_name: z.string().min(1, "Object name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  found_date: z.string().min(1, "Found date is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
});

const EditReportDialog = ({ item, open, onOpenChange, onSuccess }: EditReportDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const schema = item?.type === 'lost' ? lostObjectSchema : foundObjectSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      object_name: "",
      description: "",
      location: "",
      lost_date: "",
      found_date: "",
      contact_info: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (item && open) {
      const defaultValues: any = {
        object_name: item.object_name,
        description: item.description,
        location: item.location,
      };

      if (item.type === 'lost') {
        defaultValues.lost_date = (item as any).lost_date;
        defaultValues.contact_info = (item as any).contact_info;
      } else {
        defaultValues.found_date = (item as any).found_date;
        defaultValues.email = (item as any).email;
        defaultValues.phone = (item as any).phone || "";
      }

      form.reset(defaultValues);
    }
  }, [item, open, form]);

  const onSubmit = async (values: any) => {
    if (!item) return;

    setIsLoading(true);
    try {
      let imageUrl = item.image_url;

      // Upload new image if selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const tableName = item.type === 'lost' ? 'lost_objects' : 'found_objects';
      const updateData = {
        ...values,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Report updated",
        description: `Your ${item.type} object report has been updated successfully.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Edit {item.type === 'lost' ? 'Lost' : 'Found'} Object Report
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="object_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Object Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Black wallet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Library, Block A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed description..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.type === 'lost' ? (
                <>
                  <FormField
                    control={form.control}
                    name="lost_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Lost</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Input placeholder="Email or phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="found_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Found</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your-email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-2">
                Update Image (Optional)
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maroon file:text-white hover:file:bg-maroon/90"
              />
              {item.image_url && !selectedFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Current image:</p>
                  <img
                    src={item.image_url}
                    alt="Current"
                    className="h-20 w-20 object-cover rounded border"
                  />
                </div>
              )}
              {selectedFile && (
                <p className="text-sm text-green-600 mt-2">
                  New image selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-maroon hover:bg-maroon/90"
              >
                {isLoading ? "Updating..." : "Update Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReportDialog;
