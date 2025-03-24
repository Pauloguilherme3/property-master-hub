
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  onChange: (urls: string[]) => void;
  value: string[];
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  onChange,
  value = [],
  maxImages = 5,
  className
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (value.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // In a real application, you would upload the files to your server or cloud storage
    // For this demo, we'll simulate the upload and just create object URLs
    const newFiles = Array.from(files);
    const imagePromises = newFiles.map(file => {
      return new Promise<string>((resolve) => {
        // Check if file is an image
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Only image files are allowed",
            variant: "destructive",
          });
          resolve("");
          return;
        }

        // Simulate upload delay
        setTimeout(() => {
          resolve(URL.createObjectURL(file));
        }, 1000);
      });
    });

    Promise.all(imagePromises).then(urls => {
      const validUrls = urls.filter(url => url !== "");
      if (validUrls.length > 0) {
        onChange([...value, ...validUrls]);
        toast({
          title: "Images uploaded",
          description: `Successfully uploaded ${validUrls.length} images`,
        });
      }
      setIsUploading(false);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all text-center",
          dragActive
            ? "border-primary/70 bg-primary/5"
            : "border-muted-foreground/30",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading || value.length >= maxImages}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-primary/10 p-3">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col space-y-1 text-center">
            <p className="text-sm font-medium">
              Drag & drop images here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF (Max {maxImages} images)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            disabled={isUploading || value.length >= maxImages}
            className="transition-all"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Images
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-md overflow-hidden border">
                <img
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="object-cover w-full h-full transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white/80 dark:bg-gray-900/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {Array.from({ length: maxImages - value.length }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="border border-dashed rounded-md aspect-square flex items-center justify-center text-muted-foreground/50"
            >
              <span className="text-xs">Empty</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
