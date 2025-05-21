
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, MapPin, Image } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  itemName: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  lostDate: z.date({
    required_error: "Please select a date when the item was lost.",
  }),
  contactInfo: z.string().min(5, {
    message: "Contact information is required.",
  }),
  imageFile: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReportLost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      description: "",
      location: "",
      contactInfo: user?.email || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      let imageUrl = null;
      
      // Upload image if provided
      if (values.imageFile && values.imageFile.length > 0) {
        const file = values.imageFile[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `lost-items/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('item-images')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Insert record into database
      const { error } = await supabase.from('lost_items').insert({
        user_id: user?.id,
        item_name: values.itemName,
        description: values.description,
        location: values.location,
        lost_date: values.lostDate.toISOString(),
        contact_info: values.contactInfo,
        image_url: imageUrl,
        status: 'active'
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Report submitted",
        description: "Your lost item report has been submitted successfully.",
      });
      
      // Redirect back to listings page after a short delay
      setTimeout(() => {
        navigate("/listings");
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error submitting report",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 bg-gradient-to-br from-white to-grey/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-8">
              Report a Lost Item
            </h1>
            
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Blue Laptop Bag" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your item in detail (color, brand, distinguishing features, etc.)" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Last Seen Location
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Library, Block-C" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lostDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-lg flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" /> 
                            Date Lost
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value ? "text-muted-foreground" : ""
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Contact Information</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone number or email" 
                            {...field} 
                            defaultValue={user?.email || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be used to contact you if your item is found.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="text-lg flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Upload Image (Optional)
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-primary/50">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="image-upload"
                              onChange={(e) => {
                                handleImageChange(e);
                                onChange(e.target.files);
                              }}
                              {...fieldProps}
                            />
                            <label 
                              htmlFor="image-upload" 
                              className="cursor-pointer flex flex-col items-center justify-center w-full"
                            >
                              {imagePreview ? (
                                <div className="relative w-full">
                                  <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="mx-auto max-h-48 object-contain rounded-md" 
                                  />
                                  <p className="text-sm text-center mt-2 text-muted-foreground">
                                    Click to change image
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Image className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-sm text-center text-muted-foreground">
                                    Click to upload an image of your lost item
                                  </p>
                                </>
                              )}
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-maroon hover:bg-maroon/90 text-white"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReportLost;
