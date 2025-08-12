import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Home, Upload, Image, FileText, Map } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { PhotoUploadCard } from '@/components/forms/PhotoUploadCard';
import { CategorySelectionCard } from '@/components/forms/CategorySelectionCard';
import { DadosBasicosTab } from '@/components/forms/DadosBasicosTab';
import { CategoriasTab } from '@/components/forms/CategoriasTab';
import { CamposPersonalizadosTab } from '@/components/forms/CamposPersonalizadosTab';
import { GoogleMapsTab } from '@/components/forms/GoogleMapsTab';
import { MidiaTab } from '@/components/forms/MidiaTab';

interface EmpreendimentoFormData {
  nome: string;
  codigo: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  endereco_completo: string;
  latitude: number | null;
  longitude: number | null;
  metragem_min: number | null;
  metragem_max: number | null;
  status_empreendimento: string;
  foto_capa_url: string;
  categoria_id: string;
  equipes_ids: string[];
  cidades_ids: string[];
  construtoras_ids: string[];
  faixas_preco_ids: string[];
  segmentos_ids: string[];
  campos_personalizados: Record<string, any>;
}

export default function EmpreendimentoCadastro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dados-basicos');
  
  const [formData, setFormData] = useState<EmpreendimentoFormData>({
    nome: '',
    codigo: '',
    titulo: '',
    subtitulo: '',
    descricao: '',
    endereco_completo: '',
    latitude: null,
    longitude: null,
    metragem_min: null,
    metragem_max: null,
    status_empreendimento: 'ativo',
    foto_capa_url: '',
    categoria_id: '',
    equipes_ids: [],
    cidades_ids: [],
    construtoras_ids: [],
    faixas_preco_ids: [],
    segmentos_ids: [],
    campos_personalizados: {}
  });

  const [categorias, setCategorias] = useState<any[]>([]);
  const [equipes, setEquipes] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load categories and teams - we'll handle missing tables gracefully
      const [categoriasResult, equipesResult] = await Promise.allSettled([
        supabase.from('categorias').select('*').eq('ativo', true),
        supabase.from('equipes').select('*')
      ]);

      if (categoriasResult.status === 'fulfilled' && categoriasResult.value.data) {
        setCategorias(categoriasResult.value.data);
      }
      
      if (equipesResult.status === 'fulfilled' && equipesResult.value.data) {
        setEquipes(equipesResult.value.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.categoria_id) {
      toast.error('Nome e categoria são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Create the main empreendimento record
      const { data: empreendimento, error } = await supabase
        .from('empreendimentos')
        .insert({
          nome: formData.nome,
          codigo: formData.codigo,
          titulo: formData.titulo,
          subtitulo: formData.subtitulo,
          descricao: formData.descricao,
          endereco_completo: formData.endereco_completo,
          latitude: formData.latitude,
          longitude: formData.longitude,
          metragem_min: formData.metragem_min,
          metragem_max: formData.metragem_max,
          status_empreendimento: formData.status_empreendimento,
          foto_capa_url: formData.foto_capa_url
        })
        .select()
        .single();

      if (error) throw error;

      // Create relationships
      try {
        // Category relationship
        if (formData.categoria_id) {
          await supabase.from('empreendimento_categorias').insert({
            empreendimento_id: empreendimento.id,
            categoria_id: formData.categoria_id
          });
        }

        // Team relationships
        if (formData.equipes_ids.length > 0) {
          await supabase.from('empreendimento_equipes').insert(
            formData.equipes_ids.map(id => ({
              empreendimento_id: empreendimento.id,
              equipe_id: id
            }))
          );
        }

        // City relationships
        if (formData.cidades_ids.length > 0) {
          await supabase.from('empreendimento_cidades').insert(
            formData.cidades_ids.map(id => ({
              empreendimento_id: empreendimento.id,
              cidade_id: id
            }))
          );
        }

        // Constructor relationships
        if (formData.construtoras_ids.length > 0) {
          await supabase.from('empreendimento_construtoras').insert(
            formData.construtoras_ids.map(id => ({
              empreendimento_id: empreendimento.id,
              construtora_id: id
            }))
          );
        }

        // Price range relationships
        if (formData.faixas_preco_ids.length > 0) {
          await supabase.from('empreendimento_faixas_preco').insert(
            formData.faixas_preco_ids.map(id => ({
              empreendimento_id: empreendimento.id,
              faixa_preco_id: id
            }))
          );
        }

        // Segment relationships
        if (formData.segmentos_ids.length > 0) {
          await supabase.from('empreendimento_segmentos').insert(
            formData.segmentos_ids.map(id => ({
              empreendimento_id: empreendimento.id,
              segmento_id: id
            }))
          );
        }
      } catch (relError) {
        console.error('Erro ao criar relacionamentos:', relError);
      }

      toast.success('Empreendimento cadastrado com sucesso!');
      navigate(`/empreendimentos/${empreendimento.id}`);
    } catch (error) {
      console.error('Erro ao salvar empreendimento:', error);
      toast.error('Erro ao salvar empreendimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header com Breadcrumbs */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>Início</span>
              <ChevronRight className="h-4 w-4" />
              <span>Empreendimentos</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Cadastro</span>
            </div>
            <Button onClick={handleSave} disabled={loading} className="px-8">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-1 space-y-6">
            <PhotoUploadCard 
              imageUrl={formData.foto_capa_url}
              onImageChange={(url) => updateFormData('foto_capa_url', url)}
            />
            
            <CategorySelectionCard
              categorias={categorias}
              equipes={equipes}
              selectedCategoria={formData.categoria_id}
              selectedEquipes={formData.equipes_ids}
              onCategoriaChange={(id) => updateFormData('categoria_id', id)}
              onEquipesChange={(ids) => updateFormData('equipes_ids', ids)}
            />
          </div>

          {/* Coluna Direita - Área Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Card de Informações */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Empreendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
                    <TabsTrigger value="categorias">Categorias</TabsTrigger>
                    <TabsTrigger value="campos-personalizados">Campos Personalizados</TabsTrigger>
                    <TabsTrigger value="google-maps">Google Maps</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dados-basicos" className="mt-6">
                    <DadosBasicosTab formData={formData} updateFormData={updateFormData} />
                  </TabsContent>
                  
                  <TabsContent value="categorias" className="mt-6">
                    <CategoriasTab formData={formData} updateFormData={updateFormData} />
                  </TabsContent>
                  
                  <TabsContent value="campos-personalizados" className="mt-6">
                    <CamposPersonalizadosTab formData={formData} updateFormData={updateFormData} />
                  </TabsContent>
                  
                  <TabsContent value="google-maps" className="mt-6">
                    <GoogleMapsTab formData={formData} updateFormData={updateFormData} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Card de Mídia */}
            <Card>
              <CardHeader>
                <CardTitle>Arquivos e Mídia</CardTitle>
              </CardHeader>
              <CardContent>
                <MidiaTab empreendimentoId={null} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}