
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, MapPin, Image, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  foundDate: z.date({
    required_error: "Please select a date when you found the item.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  imageFile: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReportFound = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      description: "",
      location: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast({
      title: "Report submitted",
      description: "Your found item report has been submitted successfully.",
    });
    
    // In a real app, this would send the data to an API
    // For now, we'll just redirect back to home after a short delay
    setTimeout(() => {
      navigate("/");
    }, 2000);
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
            <h1 className="text-3xl md:text-4xl font-bold text-mustard mb-8">
              Report a Found Item
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
                            placeholder="Please describe the item in detail (color, brand, distinguishing features, etc.)" 
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
                            Where Found
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
                      name="foundDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-lg flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" /> 
                            Date Found
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

                  {/* Contact Information Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please provide your contact information so we can reach out to you if someone claims this item.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" type="email" {...field} />
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
                            <FormLabel className="text-lg flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Phone (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>
                              Your contact information will only be shared with GITAM staff.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

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
                                    Click to upload an image of the found item
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
                      className="w-full md:w-auto bg-mustard hover:bg-mustard/90 text-white"
                      size="lg"
                    >
                      Submit Report
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

export default ReportFound;
