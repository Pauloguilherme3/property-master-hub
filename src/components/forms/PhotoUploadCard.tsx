import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhotoUploadCardProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export function PhotoUploadCard({ imageUrl, onImageChange }: PhotoUploadCardProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `fotos-capa/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('empreendimentos-imagens')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('empreendimentos-imagens')
        .getPublicUrl(filePath);

      onImageChange(data.publicUrl);
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao carregar imagem');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageChange('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Foto de Capa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {imageUrl ? (
            <div className="relative">
              <img 
                src={imageUrl} 
                alt="Foto de capa" 
                className="w-full h-48 object-cover rounded-lg border"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Clique para adicionar uma foto de capa
              </p>
              <Button variant="outline" disabled={uploading} asChild>
                <label htmlFor="foto-capa" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Carregando...' : 'Selecionar Arquivo'}
                </label>
              </Button>
              <input
                id="foto-capa"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}