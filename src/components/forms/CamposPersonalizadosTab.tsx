import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

interface CamposPersonalizadosTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function CamposPersonalizadosTab({ formData, updateFormData }: CamposPersonalizadosTabProps) {
  const [camposPersonalizados, setCamposPersonalizados] = useState<any[]>([]);

  useEffect(() => {
    loadCamposPersonalizados();
  }, []);

  const loadCamposPersonalizados = async () => {
    try {
      const { data, error } = await supabase
        .from('campos_personalizados')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (error) throw error;
      setCamposPersonalizados(data || []);
    } catch (error) {
      console.warn('Tabela campos_personalizados não existe ainda');
    }
  };

  const updateCampoPersonalizado = (campoId: string, valor: any) => {
    const currentValues = formData.campos_personalizados || {};
    updateFormData('campos_personalizados', {
      ...currentValues,
      [campoId]: valor
    });
  };

  const renderCampo = (campo: any) => {
    const valor = formData.campos_personalizados?.[campo.id] || '';

    switch (campo.tipo) {
      case 'texto':
        return (
          <Input
            value={valor}
            onChange={(e) => updateCampoPersonalizado(campo.id, e.target.value)}
            placeholder={`Digite ${campo.nome.toLowerCase()}`}
          />
        );

      case 'numero':
        return (
          <Input
            type="number"
            value={valor}
            onChange={(e) => updateCampoPersonalizado(campo.id, e.target.value)}
            placeholder={`Digite ${campo.nome.toLowerCase()}`}
          />
        );

      case 'data':
        return (
          <Input
            type="date"
            value={valor}
            onChange={(e) => updateCampoPersonalizado(campo.id, e.target.value)}
          />
        );

      case 'selecao':
        return (
          <Select value={valor} onValueChange={(value) => updateCampoPersonalizado(campo.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${campo.nome.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(campo.opcoes || []).map((opcao: string, index: number) => (
                <SelectItem key={index} value={opcao}>
                  {opcao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'booleano':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={valor === true || valor === 'true'}
              onCheckedChange={(checked) => updateCampoPersonalizado(campo.id, checked)}
            />
            <Label>Sim</Label>
          </div>
        );

      default:
        return (
          <Textarea
            value={valor}
            onChange={(e) => updateCampoPersonalizado(campo.id, e.target.value)}
            placeholder={`Digite ${campo.nome.toLowerCase()}`}
            rows={3}
          />
        );
    }
  };

  if (camposPersonalizados.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Nenhum campo personalizado configurado.</p>
        <p className="text-sm mt-2">
          Configure campos personalizados na área administrativa para eles aparecerem aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {camposPersonalizados.map((campo) => (
        <div key={campo.id}>
          <Label>
            {campo.nome}
            {campo.obrigatorio && <span className="text-destructive ml-1">*</span>}
          </Label>
          {renderCampo(campo)}
          {campo.descricao && (
            <p className="text-xs text-muted-foreground mt-1">{campo.descricao}</p>
          )}
        </div>
      ))}
    </div>
  );
}