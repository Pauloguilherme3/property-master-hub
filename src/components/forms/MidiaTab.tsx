import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image, FileText, FolderPlus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MidiaTabProps {
  empreendimentoId: string | null;
}

interface Categoria {
  id: string;
  nome: string;
  arquivos: any[];
}

export function MidiaTab({ empreendimentoId }: MidiaTabProps) {
  const [categoriasImagens, setCategoriasImagens] = useState<Categoria[]>([]);
  const [categoriasPlants, setCategoriasPlants] = useState<Categoria[]>([]);
  const [categoriasArquivos, setCategoriasArquivos] = useState<Categoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [tipoCategoria, setTipoCategoria] = useState<'imagem' | 'planta' | 'arquivo'>('imagem');

  const adicionarCategoria = () => {
    if (!novaCategoria.trim()) return;

    const categoria: Categoria = {
      id: Date.now().toString(),
      nome: novaCategoria,
      arquivos: []
    };

    switch (tipoCategoria) {
      case 'imagem':
        setCategoriasImagens(prev => [...prev, categoria]);
        break;
      case 'planta':
        setCategoriasPlants(prev => [...prev, categoria]);
        break;
      case 'arquivo':
        setCategoriasArquivos(prev => [...prev, categoria]);
        break;
    }

    setNovaCategoria('');
  };

  const removerCategoria = (tipo: 'imagem' | 'planta' | 'arquivo', categoriaId: string) => {
    switch (tipo) {
      case 'imagem':
        setCategoriasImagens(prev => prev.filter(c => c.id !== categoriaId));
        break;
      case 'planta':
        setCategoriasPlants(prev => prev.filter(c => c.id !== categoriaId));
        break;
      case 'arquivo':
        setCategoriasArquivos(prev => prev.filter(c => c.id !== categoriaId));
        break;
    }
  };

  const renderCategorias = (categorias: Categoria[], tipo: 'imagem' | 'planta' | 'arquivo') => (
    <div className="space-y-4">
      {/* Adicionar Nova Categoria */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Nome da nova categoria de ${tipo}s`}
              value={tipoCategoria === tipo ? novaCategoria : ''}
              onChange={(e) => {
                setNovaCategoria(e.target.value);
                setTipoCategoria(tipo);
              }}
            />
            <Button onClick={adicionarCategoria} disabled={!novaCategoria.trim()}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Criar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Categorias */}
      {categorias.map((categoria) => (
        <Card key={categoria.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{categoria.nome}</Badge>
                <span className="text-xs text-muted-foreground">
                  {categoria.arquivos.length} arquivo(s)
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removerCategoria(tipo, categoria.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Área de Upload */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <Button variant="outline" size="sm">
                Selecionar Arquivos
              </Button>
            </div>

            {/* Lista de Arquivos (quando implementado) */}
            {categoria.arquivos.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                {categoria.arquivos.map((arquivo, index) => (
                  <div key={index} className="border rounded p-2 text-xs">
                    {arquivo.nome}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {categorias.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p>Nenhuma categoria criada ainda.</p>
          <p className="text-sm">Crie uma categoria acima para começar a organizar seus arquivos.</p>
        </div>
      )}
    </div>
  );

  return (
    <Tabs defaultValue="imagens">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="imagens" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Imagens
        </TabsTrigger>
        <TabsTrigger value="plantas" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Plantas
        </TabsTrigger>
        <TabsTrigger value="arquivos" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Arquivos
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="imagens" className="mt-6">
        {renderCategorias(categoriasImagens, 'imagem')}
      </TabsContent>
      
      <TabsContent value="plantas" className="mt-6">
        {renderCategorias(categoriasPlants, 'planta')}
      </TabsContent>
      
      <TabsContent value="arquivos" className="mt-6">
        {renderCategorias(categoriasArquivos, 'arquivo')}
      </TabsContent>
    </Tabs>
  );
}