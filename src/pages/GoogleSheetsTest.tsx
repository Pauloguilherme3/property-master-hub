
import { useEffect, useState } from "react";
import { googleSheetsService } from "@/services/googleSheetsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GoogleSheetsTestPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const connectToGoogleSheets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await googleSheetsService.connect();
      setIsConnected(googleSheetsService.isConnectedToSheets());
      
      toast({
        title: "Conectado com sucesso",
        description: "A conexão com o Google Sheets foi estabelecida.",
        variant: "default",
      });
    } catch (err) {
      console.error("Erro ao conectar ao Google Sheets:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao conectar ao Google Sheets");
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Google Sheets. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if already connected on component mount
    setIsConnected(googleSheetsService.isConnectedToSheets());
    
    // Cleanup on unmount
    return () => {
      if (googleSheetsService.isConnectedToSheets()) {
        googleSheetsService.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="container max-w-3xl py-10 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Teste de Conexão Google Sheets
          </CardTitle>
          <CardDescription>
            Verificação da conexão com o Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              )}
              <span>Status da Conexão: </span>
              <span className={`ml-2 font-medium ${isConnected ? 'text-green-500' : 'text-amber-500'}`}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <Button 
              onClick={connectToGoogleSheets} 
              disabled={isLoading || isConnected}
              variant={isConnected ? "outline" : "default"}
            >
              {isLoading ? "Conectando..." : isConnected ? "Conectado" : "Conectar"}
            </Button>
          </div>

          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-800">
              <h3 className="font-semibold mb-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Erro de Conexão
              </h3>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="p-4 border rounded-lg bg-blue-50 text-blue-800">
            <h3 className="font-medium mb-2">Instruções:</h3>
            <ol className="list-decimal ml-5 space-y-1 text-sm">
              <li>Este é um serviço simulado do Google Sheets para testes</li>
              <li>Em um ambiente real, seria necessário configurar as credenciais da API do Google</li>
              <li>Clique no botão "Conectar" para testar a conexão simulada</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSheetsTestPage;
