
import { useEffect, useState } from "react";
import { mongoDBService } from "@/services/mongoService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MongoDBTestPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const connectToMongoDB = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await mongoDBService.connect();
      setIsConnected(mongoDBService.isConnectedToDB());
      
      // Test connection by trying to get some data
      if (mongoDBService.isConnectedToDB()) {
        const collection = mongoDBService.getCollection("test");
        await collection.find().toArray();
      }
      
      toast({
        title: "Conectado com sucesso",
        description: import.meta.env.VITE_MONGODB_API_URL 
          ? "A conexão com a API do MongoDB foi estabelecida."
          : "Conectado no modo simulado (mock).",
        variant: "default",
      });
    } catch (err) {
      console.error("Erro ao conectar ao MongoDB:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao conectar ao MongoDB");
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao MongoDB. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if already connected on component mount
    setIsConnected(mongoDBService.isConnectedToDB());
    
    // Cleanup on unmount
    return () => {
      if (mongoDBService.isConnectedToDB()) {
        mongoDBService.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="container max-w-3xl py-10 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Teste de Conexão MongoDB
          </CardTitle>
          <CardDescription>
            Verificação da conexão com o banco de dados MongoDB
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
              onClick={connectToMongoDB} 
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
              <li>Certifique-se de que suas variáveis de ambiente estão configuradas corretamente</li>
              <li>
                {import.meta.env.VITE_MONGODB_API_URL 
                  ? "A URL da API MongoDB deve ser fornecida na variável VITE_MONGODB_API_URL" 
                  : "Sem API configurada - operando no modo simulado"}
              </li>
              <li>Clique no botão "Conectar" para testar a conexão</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MongoDBTestPage;
