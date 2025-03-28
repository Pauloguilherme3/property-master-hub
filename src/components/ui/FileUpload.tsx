
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { driveService } from "@/services/driveService";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2, File, X } from "lucide-react";

interface FileUploadProps {
  onFileUploaded?: (fileInfo: any) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  buttonText?: string;
  className?: string;
}

export function FileUpload({
  onFileUploaded,
  acceptedTypes = "*",
  maxSizeMB = 5,
  buttonText = "Fazer upload de arquivo",
  className = "",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo excede o tamanho máximo de ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Connect to drive if not already connected
      if (!driveService.isConnected()) {
        await driveService.connect();
      }
      
      // Upload file to Google Drive (mock)
      const uploadedFile = await driveService.uploadFile(file);
      
      setUploadedFile(uploadedFile);
      
      if (onFileUploaded) {
        onFileUploaded(uploadedFile);
      }
      
      toast({
        title: "Upload realizado com sucesso",
        description: "O arquivo foi enviado para o Google Drive.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer o upload do arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveFile = async () => {
    if (!uploadedFile) return;
    
    try {
      await driveService.deleteFile(uploadedFile.id);
      setUploadedFile(null);
      
      if (onFileUploaded) {
        onFileUploaded(null);
      }
      
      toast({
        title: "Arquivo removido",
        description: "O arquivo foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error removing file:", error);
      toast({
        title: "Erro ao remover arquivo",
        description: "Não foi possível remover o arquivo.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />
      
      {!uploadedFile ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-32 flex flex-col items-center justify-center border-dashed gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Enviando arquivo...</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span>{buttonText}</span>
              <span className="text-xs text-muted-foreground">
                Máximo: {maxSizeMB}MB
              </span>
            </>
          )}
        </Button>
      ) : (
        <div className="relative border rounded-md p-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemoveFile}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {uploadedFile.thumbnailUrl && (
            <div className="mt-3">
              <img 
                src={uploadedFile.thumbnailUrl} 
                alt={uploadedFile.name} 
                className="rounded-md max-h-32 object-contain mx-auto"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
