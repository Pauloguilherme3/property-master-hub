
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";
import { Empreendimento } from "@/types";

interface EditEmpreendimentoImagesProps {
  empreendimento: Empreendimento;
  onUpdate: (updatedEmpreendimento: Empreendimento) => void;
}

export function EditEmpreendimentoImages({ empreendimento, onUpdate }: EditEmpreendimentoImagesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>(empreendimento.imagens || []);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call to update empreendimento images
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEmpreendimento = {
        ...empreendimento,
        imagens: images
      };
      
      onUpdate(updatedEmpreendimento);
      setIsEditing(false);
      
      toast({
        title: "Imagens atualizadas",
        description: "As imagens do empreendimento foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao atualizar as imagens.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setImages(empreendimento.imagens || []);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar Imagens
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Editar Imagens do Empreendimento
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          value={images}
          onChange={setImages}
          maxImages={10}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
