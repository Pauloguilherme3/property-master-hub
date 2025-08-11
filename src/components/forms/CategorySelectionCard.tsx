import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CategorySelectionCardProps {
  categorias: any[];
  equipes: any[];
  selectedCategoria: string;
  selectedEquipes: string[];
  onCategoriaChange: (id: string) => void;
  onEquipesChange: (ids: string[]) => void;
}

export function CategorySelectionCard({
  categorias,
  equipes,
  selectedCategoria,
  selectedEquipes,
  onCategoriaChange,
  onEquipesChange
}: CategorySelectionCardProps) {
  const removeEquipe = (equipeId: string) => {
    onEquipesChange(selectedEquipes.filter(id => id !== equipeId));
  };

  const addEquipe = (equipeId: string) => {
    if (!selectedEquipes.includes(equipeId)) {
      onEquipesChange([...selectedEquipes, equipeId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categorias Principais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Categoria */}
        <div>
          <Label htmlFor="categoria">Categoria do Empreendimento</Label>
          <Select value={selectedCategoria} onValueChange={onCategoriaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seletor de Equipes */}
        <div>
          <Label htmlFor="equipes">Equipes que podem visualizar</Label>
          <Select onValueChange={addEquipe}>
            <SelectTrigger>
              <SelectValue placeholder="Adicionar equipe" />
            </SelectTrigger>
            <SelectContent>
              {equipes
                .filter(equipe => !selectedEquipes.includes(equipe.id))
                .map((equipe) => (
                  <SelectItem key={equipe.id} value={equipe.id}>
                    {equipe.nome}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          {/* Badges das equipes selecionadas */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedEquipes.map((equipeId) => {
              const equipe = equipes.find(e => e.id === equipeId);
              return equipe ? (
                <Badge key={equipeId} variant="secondary" className="flex items-center gap-1">
                  {equipe.nome}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeEquipe(equipeId)}
                  />
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}