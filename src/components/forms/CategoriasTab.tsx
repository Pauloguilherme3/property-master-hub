import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CategoriasTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function CategoriasTab({ formData, updateFormData }: CategoriasTabProps) {
  const [cidades, setCidades] = useState<any[]>([]);
  const [construtoras, setConstrutoras] = useState<any[]>([]);
  const [faixasPreco, setFaixasPreco] = useState<any[]>([]);
  const [segmentos, setSegmentos] = useState<any[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      // Load all options - handle missing tables gracefully
      const promises = [
        supabase.from('cidades').select('*').eq('ativo', true),
        supabase.from('construtoras').select('*').eq('ativo', true),
        supabase.from('faixas_preco').select('*').eq('ativo', true),
        supabase.from('segmentos').select('*').eq('ativo', true)
      ];

      const results = await Promise.allSettled(promises);
      
      if (results[0].status === 'fulfilled' && results[0].value.data) {
        setCidades(results[0].value.data);
      }
      if (results[1].status === 'fulfilled' && results[1].value.data) {
        setConstrutoras(results[1].value.data);
      }
      if (results[2].status === 'fulfilled' && results[2].value.data) {
        setFaixasPreco(results[2].value.data);
      }
      if (results[3].status === 'fulfilled' && results[3].value.data) {
        setSegmentos(results[3].value.data);
      }
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    }
  };

  const addToArray = (field: string, value: string, array: any[]) => {
    const currentValues = formData[field] || [];
    if (!currentValues.includes(value)) {
      updateFormData(field, [...currentValues, value]);
    }
  };

  const removeFromArray = (field: string, value: string) => {
    const currentValues = formData[field] || [];
    updateFormData(field, currentValues.filter((id: string) => id !== value));
  };

  const renderMultiSelect = (
    label: string,
    field: string,
    options: any[],
    placeholder: string
  ) => (
    <div>
      <Label>{label}</Label>
      <Select onValueChange={(value) => addToArray(field, value, options)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter(option => !(formData[field] || []).includes(option.id))
            .map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.nome}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {(formData[field] || []).map((optionId: string) => {
          const option = options.find(o => o.id === optionId);
          return option ? (
            <Badge key={optionId} variant="secondary" className="flex items-center gap-1">
              {option.nome}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFromArray(field, optionId)}
              />
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderMultiSelect('Cidades', 'cidades_ids', cidades, 'Adicionar cidade')}
      {renderMultiSelect('Construtoras', 'construtoras_ids', construtoras, 'Adicionar construtora')}
      {renderMultiSelect('Faixas de Preço', 'faixas_preco_ids', faixasPreco, 'Adicionar faixa de preço')}
      {renderMultiSelect('Segmentos', 'segmentos_ids', segmentos, 'Adicionar segmento')}
    </div>
  );
}