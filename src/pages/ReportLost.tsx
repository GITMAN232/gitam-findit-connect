
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, MapPin, Mail, MessageCircle, Star, Info } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { createLostObject, uploadImage } from "@/services/supabaseApi";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { DragDropImage } from "@/components/ui/drag-drop-image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { campuses } from "@/types/ListingTypes";

const formSchema = z.object({
  objectName: z.string().min(2, "Object name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  location: z.string().min(2, "Location is required."),
  lostDate: z.date({ required_error: "Please select a date when the object was lost." }),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  campus: z.string().min(1, "Please select a campus."),
  imageFile: z.instanceof(FileList).optional()
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
      objectName: "",
      description: "",
      location: "",
      email: user?.email || "",
      phone: "",
      campus: ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      let imageUrl = null;

      if (values.imageFile && values.imageFile.length > 0) {
        const file = values.imageFile[0];
        imageUrl = await uploadImage(file);
      }

      await createLostObject({
        object_name: values.objectName,
        description: values.description,
        location: values.location,
        lost_date: values.lostDate.toISOString().split('T')[0],
        contact_info: values.email,
        image_url: imageUrl,
        campus: values.campus,
      });

      toast({
        title: "✨ Report submitted successfully!",
        description: "Your submission is pending admin approval. You'll be notified once it's live!"
      });

      navigate("/my-reportings");
    } catch (error: any) {
      toast({
        title: "Oops! Something went wrong",
        description: error.message || "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      
      // Create FileList for form
      const dt = new DataTransfer();
      dt.items.add(file);
      form.setValue('imageFile', dt.files);
    } else {
      setImagePreview(null);
      form.setValue('imageFile', undefined);
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-gradient-to-br from-white via-gray-50/30 to-mustard/5 min-h-screen">
        <Navbar />
        <div className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 bg-maroon/10 text-maroon px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span>🔍</span>
                  Lost Something?
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-maroon leading-tight">
                  Let's help you find it faster!
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Fill out the details below and our community will help you track down your missing object.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Campus Selection Card */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <span className="text-lg">🏫</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Campus Selection</h2>
                    </div>
                    
                    <FormField control={form.control} name="campus" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full h-14 px-4 text-left font-normal border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 focus:border-maroon/60">
                              <SelectValue placeholder="Which Campus? *" />
                            </SelectTrigger>
                            <SelectContent>
                              {campuses.map((campus) => (
                                <SelectItem key={campus} value={campus}>
                                  {campus}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Object Details Card */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center">
                        <span className="text-lg">🧾</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Object Details</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="objectName" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingInput
                              label="What did you lose? *"
                              error={fieldState.error?.message}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="lostDate" render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={`w-full h-14 px-4 pt-6 pb-2 text-left font-normal border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 focus:border-maroon/60 ${
                                    !field.value ? "text-gray-500" : "text-gray-900"
                                  }`}
                                >
                                  <span className="flex-1">
                                    {field.value ? format(field.value, "PPP") : ""}
                                  </span>
                                  <CalendarIcon className="h-4 w-4 opacity-50 ml-2" />
                                  <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                                    field.value ? "top-2 text-xs font-medium text-maroon" : "top-1/2 transform -translate-y-1/2 text-base text-gray-500"
                                  }`}>
                                    {field.value ? "When did you last see it? *" : "Select date..."}
                                  </label>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={date => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                className="rounded-md border-0"
                                classNames={{
                                  day_selected: "bg-maroon text-white hover:bg-maroon hover:text-white focus:bg-maroon focus:text-white",
                                  day_today: "bg-mustard/20 text-maroon font-bold",
                                  nav_button: "hover:bg-maroon/10",
                                  head_cell: "text-maroon font-medium"
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="mt-6">
                      <FormField control={form.control} name="description" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingTextarea
                              label="Describe your object in detail (color, brand, size, etc.) *"
                              error={fieldState.error?.message}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Location Info Card */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-mustard/10 rounded-xl flex items-center justify-center">
                        <span className="text-lg">📍</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Location Info</h2>
                    </div>
                    
                    <FormField control={form.control} name="location" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <FloatingInput
                              label="Where did you last see it? *"
                              error={fieldState.error?.message}
                              {...field}
                            />
                            <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Contact Info Card */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                        <span className="text-lg">📞</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Contact Info</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <FloatingInput
                                label="Your email address *"
                                type="email"
                                error={fieldState.error?.message}
                                {...field}
                              />
                              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <FloatingInput
                                label="WhatsApp number (optional)"
                                type="tel"
                                {...field}
                              />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Optional WhatsApp number for faster communication</p>
                                </TooltipContent>
                              </Tooltip>
                              <MessageCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Image Upload Card */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <span className="text-lg">📸</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800">Add a Photo</h2>
                        <p className="text-gray-600">A picture helps others recognize your object</p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="text-gray-400 h-5 w-5 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adding a photo increases your chances of finding your object!</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <DragDropImage
                      onImageChange={handleImageChange}
                      preview={imagePreview}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-maroon hover:bg-mustard text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>✍️</span>
                          Report Lost Object
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default ReportLost;
