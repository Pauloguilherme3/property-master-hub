
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Empreendimento } from "@/types";
import { getDocument } from "@/services/dbService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  ArrowLeft,
  Building,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Tag,
  Home
} from "lucide-react";

const EmpreendimentoPersonalizado = () => {
  const { id } = useParams<{ id: string }>();
  const [empreendimento, setEmpreendimento] = useState<Empreendimento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmpreendimento = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getDocument("empreendimentos", id);
        
        if (data) {
          setEmpreendimento(data as Empreendimento);
        } else {
          toast({
            variant: "destructive",
            title: "Empreendimento não encontrado",
            description: "Não foi possível encontrar o empreendimento solicitado."
          });
        }
      } catch (error) {
        console.error("Erro ao buscar empreendimento:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar",
          description: "Ocorreu um erro ao carregar os dados do empreendimento."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpreendimento();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!empreendimento) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Empreendimento não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O empreendimento solicitado não foi encontrado ou não está mais disponível.
        </p>
        <Button asChild>
          <Link to="/empreendimentos">Ver todos os empreendimentos</Link>
        </Button>
      </div>
    );
  }

  // Helper function to format price in BRL
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero section */}
      <div 
        className="h-[40vh] md:h-[50vh] bg-cover bg-center relative" 
        style={{ 
          backgroundImage: empreendimento.imagens?.length 
            ? `url(${empreendimento.imagens[0]})` 
            : "none" 
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {empreendimento.nome}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <span>
                {empreendimento.cidade}, {empreendimento.estado}
              </span>
            </div>
            <Badge className="bg-primary/90 text-white hover:bg-primary">
              {empreendimento.tipoImovel === "lote" ? "Loteamento" : 
                empreendimento.tipoImovel === "casa" ? "Casa" :
                empreendimento.tipoImovel === "apartamento" ? "Apartamento" : "Comercial"}
            </Badge>
          </div>
        </div>
        
        <div className="absolute top-4 left-4">
          <Button variant="secondary" size="sm" asChild>
            <Link to="/empreendimentos" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <Card className="shadow-xl border-none">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Informações principais */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Sobre o Empreendimento</h2>
                <p className="text-muted-foreground mb-6">{empreendimento.descricao}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                    <Tag className="h-6 w-6 text-primary mb-2" />
                    <span className="font-bold">{formatPrice(empreendimento.preco)}</span>
                    <span className="text-xs text-muted-foreground">Preço</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                    <Square className="h-6 w-6 text-primary mb-2" />
                    <span className="font-bold">{empreendimento.area} m²</span>
                    <span className="text-xs text-muted-foreground">Área</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                    <Bed className="h-6 w-6 text-primary mb-2" />
                    <span className="font-bold">{empreendimento.dormitorios}</span>
                    <span className="text-xs text-muted-foreground">Dormitórios</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                    <Bath className="h-6 w-6 text-primary mb-2" />
                    <span className="font-bold">{empreendimento.banheiros}</span>
                    <span className="text-xs text-muted-foreground">Banheiros</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Localização</h3>
                  <p className="mb-2">
                    <MapPin className="inline-block mr-2 h-4 w-4" />
                    {empreendimento.endereco}, {empreendimento.cidade} - {empreendimento.estado}, {empreendimento.cep}
                  </p>
                  
                  {empreendimento.coordenadas && (
                    <div className="h-64 bg-muted rounded-md mt-4">
                      <iframe
                        title="Mapa de localização"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://maps.google.com/maps?q=${empreendimento.coordenadas.lat},${empreendimento.coordenadas.lng}&z=15&output=embed`}
                        allowFullScreen
                        className="rounded-md"
                      ></iframe>
                    </div>
                  )}
                </div>
                
                {empreendimento.etapaConstrucao && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Andamento da Obra</h3>
                    <div className="space-y-4">
                      {empreendimento.etapaConstrucao.map((etapa, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{etapa.nome}</span>
                            <span>{etapa.porcentagemConcluida}%</span>
                          </div>
                          <Progress value={etapa.porcentagemConcluida} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Informações Adicionais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Construtora:</span>
                      <p className="font-medium">{empreendimento.construtora}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Previsão de Entrega:</span>
                      <p className="font-medium">{empreendimento.previsaoEntrega}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium capitalize">
                        {empreendimento.status === "disponivel" ? "Disponível" :
                         empreendimento.status === "reservado" ? "Reservado" : "Vendido"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div>
                <Card className="bg-muted/30">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Contato</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Preencha o formulário abaixo para receber mais informações sobre este empreendimento.
                    </p>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
                        <input 
                          type="text" 
                          id="name" 
                          className="w-full py-2 px-3 border rounded-md"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="w-full py-2 px-3 border rounded-md"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          className="w-full py-2 px-3 border rounded-md"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Mensagem</label>
                        <textarea 
                          id="message" 
                          rows={4}
                          className="w-full py-2 px-3 border rounded-md"
                          placeholder="Gostaria de receber mais informações sobre..."
                        ></textarea>
                      </div>
                      <Button className="w-full">Enviar Mensagem</Button>
                    </form>
                    
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4">Agendar Visita</h3>
                      <Button variant="outline" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar uma Visita
                      </Button>
                    </div>
                    
                    {empreendimento.tourVirtual && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">Tour Virtual</h3>
                        <Button variant="outline" className="w-full">
                          <Home className="mr-2 h-4 w-4" />
                          Fazer Tour Virtual
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Galeria de imagens */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Galeria</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {empreendimento.imagens?.map((imagem, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <AspectRatio ratio={4/3}>
                      <img 
                        src={imagem} 
                        alt={`${empreendimento.nome} - Imagem ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpreendimentoPersonalizado;
