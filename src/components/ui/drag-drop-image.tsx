
import React, { useState, useRef } from "react";
import { Image, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragDropImageProps {
  onImageChange: (file: File | null) => void;
  preview: string | null;
  error?: string;
  className?: string;
}

const DragDropImage = ({ onImageChange, preview, error, className }: DragDropImageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageChange(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white/80 to-gray-50/50 backdrop-blur-sm",
          isDragging 
            ? "border-maroon bg-maroon/5 scale-[1.02]" 
            : preview 
              ? "border-mustard/40 bg-mustard/5" 
              : "border-gray-300 hover:border-maroon/40 hover:bg-gray-50/80",
          error && "border-red-300"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-48 object-contain rounded-lg shadow-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <p className="text-white text-sm font-medium">Click to change</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className={cn(
              "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
              isDragging ? "bg-maroon text-white scale-110" : "bg-gray-100 text-gray-400"
            )}>
              {isDragging ? <Upload className="w-8 h-8" /> : <Image className="w-8 h-8" />}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-1">
                {isDragging ? "Drop your image here" : "Upload an image"}
              </p>
              <p className="text-sm text-gray-500">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export { DragDropImage };
