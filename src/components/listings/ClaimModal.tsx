import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const claimSchema = z.object({
  explanation: z.string().min(20, 'Please provide at least 20 characters explaining why this is yours'),
});

interface ClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemType: 'lost' | 'found';
  itemName: string;
}

export function ClaimModal({ open, onOpenChange, itemId, itemType, itemName }: ClaimModalProps) {
  const { user } = useAuth();
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof claimSchema>>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      explanation: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });
      
      if (validFiles.length !== files.length) {
        toast.error('Some files were rejected. Only JPG, PNG, and PDF under 5MB are allowed.');
      }
      
      setEvidenceFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadEvidence = async (): Promise<string[]> => {
    if (!user || evidenceFiles.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const file of evidenceFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('claim-evidence')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload evidence');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('claim-evidence')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const onSubmit = async (values: z.infer<typeof claimSchema>) => {
    if (!user) {
      toast.error('You must be logged in to submit a claim');
      return;
    }

    if (evidenceFiles.length === 0) {
      toast.error('Please upload at least one piece of evidence');
      return;
    }

    setIsSubmitting(true);

    try {
      const evidenceUrls = await uploadEvidence();

      const { error } = await supabase
        .from('claims')
        .insert({
          item_id: itemId,
          item_type: itemType,
          claimant_id: user.id,
          evidence_urls: evidenceUrls,
          explanation: values.explanation,
        });

      if (error) throw error;

      toast.success('Claim submitted successfully! We\'ll review it shortly.');
      onOpenChange(false);
      form.reset();
      setEvidenceFiles([]);
    } catch (error: any) {
      console.error('Error submitting claim:', error);
      toast.error('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim: {itemName}</DialogTitle>
          <DialogDescription>
            If this is your item, please provide proof of ownership. Upload at least one of the following:
            invoice/bill, photo of the item, ID proof, or explanation of unique marks.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormLabel>Evidence Files *</FormLabel>
              <div className="mt-2 space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-maroon transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="evidence-upload" className="cursor-pointer">
                      <span className="text-maroon font-medium">Upload files</span>
                      <span className="text-gray-600"> or drag and drop</span>
                    </label>
                    <input
                      id="evidence-upload"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or PDF (max 5MB each)
                  </p>
                </div>

                {evidenceFiles.length > 0 && (
                  <div className="space-y-2">
                    {evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs font-medium">PDF</span>
                            </div>
                          )}
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this item is yours. Include unique marks, purchase details, or other identifying information..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
