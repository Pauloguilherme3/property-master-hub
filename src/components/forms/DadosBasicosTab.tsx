import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DadosBasicosTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function DadosBasicosTab({ formData, updateFormData }: DadosBasicosTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData('nome', e.target.value)}
            placeholder="Nome do empreendimento"
          />
        </div>
        
        <div>
          <Label htmlFor="codigo">Código</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => updateFormData('codigo', e.target.value)}
            placeholder="Código interno"
          />
        </div>
        
        <div>
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => updateFormData('titulo', e.target.value)}
            placeholder="Título para exibição"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="subtitulo">Subtítulo</Label>
          <Input
            id="subtitulo"
            value={formData.subtitulo}
            onChange={(e) => updateFormData('subtitulo', e.target.value)}
            placeholder="Subtítulo descritivo"
          />
        </div>
        
        <div>
          <Label htmlFor="metragem-min">Metragem Mínima (m²)</Label>
          <Input
            id="metragem-min"
            type="number"
            value={formData.metragem_min || ''}
            onChange={(e) => updateFormData('metragem_min', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Ex: 50"
          />
        </div>
        
        <div>
          <Label htmlFor="metragem-max">Metragem Máxima (m²)</Label>
          <Input
            id="metragem-max"
            type="number"
            value={formData.metragem_max || ''}
            onChange={(e) => updateFormData('metragem_max', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Ex: 200"
          />
        </div>
      </div>
      
      <div className="md:col-span-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => updateFormData('descricao', e.target.value)}
          placeholder="Descrição detalhada do empreendimento..."
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use este campo para descrever as características principais do empreendimento
        </p>
      </div>
    </div>
  );
}