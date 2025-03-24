
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Home } from "lucide-react";
import { mockEmpreendimentos, mockUnidades } from "@/utils/animations";
import { ReservaFormulario } from "@/components/ui/ReservaFormulario";

const ReservaFormularioPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetching unidade data
  const { data: unidade, isLoading: loadingUnidade } = useQuery({
    queryKey: ["unidade", id],
    queryFn: async () => {
      // Este seria uma chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 800));
      const resultado = mockUnidades.find(u => u.id === id);
      if (!resultado) throw new Error("Unidade não encontrada");
      return resultado;
    }
  });
  
  // Fetching empreendimento data
  const { data: empreendimento, isLoading: loadingEmpreendimento } = useQuery({
    queryKey: ["empreendimento", unidade?.empreendimentoId],
    enabled: !!unidade,
    queryFn: async () => {
      // Este seria uma chamada de API em uma aplicação real
      await new Promise(resolve => setTimeout(resolve, 500));
      const resultado = mockEmpreendimentos.find(e => e.id === unidade?.empreendimentoId);
      if (!resultado) throw new Error("Empreendimento não encontrado");
      return resultado;
    }
  });
  
  const isLoading = loadingUnidade || loadingEmpreendimento;
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/empreendimentos/${unidade?.empreendimentoId}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Início
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <Link to="/empreendimentos" className="text-muted-foreground hover:text-foreground text-sm">
            Empreendimentos
          </Link>
          {empreendimento && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Link 
                to={`/empreendimentos/${empreendimento.id}`} 
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                {empreendimento.nome}
              </Link>
            </>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Reserva</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para solicitar a reserva desta unidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-muted rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ) : empreendimento && unidade ? (
              <ReservaFormulario 
                empreendimento={empreendimento} 
                unidade={unidade} 
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Unidade não encontrada ou indisponível para reserva.</p>
                <Button asChild className="mt-4">
                  <Link to="/empreendimentos">
                    Ver Empreendimentos Disponíveis
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReservaFormularioPage;
