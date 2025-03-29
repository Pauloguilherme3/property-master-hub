
import { useEffect, useState } from "react";
import { googleSheetsService } from "@/services/googleSheetsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Database, FileSpreadsheet, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const GoogleSheetsSetupPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || "");
  const [documentId, setDocumentId] = useState<string>(import.meta.env.VITE_GOOGLE_SHEETS_DOCUMENT_ID || "");
  const [testData, setTestData] = useState<any[]>([]);
  const { toast } = useToast();

  const connectToGoogleSheets = async () => {
    setIsLoading(true);
    setError(null);
    
    if (!apiKey && !import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
      setError("API Key is required to connect to Google Sheets");
      setIsLoading(false);
      return;
    }
    
    if (!documentId && !import.meta.env.VITE_GOOGLE_SHEETS_DOCUMENT_ID) {
      setError("Google Sheets Document ID is required");
      setIsLoading(false);
      return;
    }
    
    try {
      // Save to localStorage for testing purposes
      if (apiKey) localStorage.setItem('test_sheets_api_key', apiKey);
      if (documentId) localStorage.setItem('test_sheets_document_id', documentId);
      
      await googleSheetsService.connect();
      setIsConnected(googleSheetsService.isConnectedToSheets());
      
      // Try to get data
      if (googleSheetsService.isConnectedToSheets()) {
        fetchTestData();
      }
      
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
  
  const fetchTestData = async () => {
    try {
      const collection = googleSheetsService.getCollection("empreendimentos");
      const data = await collection.find().toArray();
      setTestData(data);
    } catch (error) {
      console.error("Error fetching test data:", error);
    }
  };
  
  const addTestProperty = async () => {
    try {
      setIsLoading(true);
      const collection = googleSheetsService.getCollection("empreendimentos");
      
      // Create a test property
      const testProperty = {
        nome: `Teste Empreendimento ${new Date().toLocaleTimeString()}`,
        descricao: "Propriedade criada para teste da integração com Google Sheets",
        preco: 450000,
        endereco: "Rua de Teste, 123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        construtora: "Construtora Teste",
        tipoImovel: "apartamento",
        previsaoEntrega: new Date().toISOString().split('T')[0],
        dormitorios: 3,
        banheiros: 2,
        area: 85,
        status: "disponivel",
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };
      
      const result = await collection.insertOne(testProperty);
      
      toast({
        title: "Teste concluído",
        description: `Propriedade de teste criada com ID: ${result.insertedId}`,
        variant: "default",
      });
      
      // Refresh data
      fetchTestData();
    } catch (error) {
      console.error("Error adding test property:", error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível criar a propriedade de teste.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if already connected on component mount
    setIsConnected(googleSheetsService.isConnectedToSheets());
    
    // Try to get saved values
    const savedApiKey = localStorage.getItem('test_sheets_api_key');
    const savedDocumentId = localStorage.getItem('test_sheets_document_id');
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedDocumentId) setDocumentId(savedDocumentId);
    
    // If connected, fetch test data
    if (googleSheetsService.isConnectedToSheets()) {
      fetchTestData();
    }
    
    // Cleanup on unmount
    return () => {
      if (googleSheetsService.isConnectedToSheets()) {
        googleSheetsService.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="container max-w-4xl py-10 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Configuração do Google Sheets
          </CardTitle>
          <CardDescription>
            Configure a integração com o Google Sheets para armazenar dados do sistema
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
              disabled={isLoading}
              variant={isConnected ? "outline" : "default"}
            >
              {isLoading ? "Conectando..." : isConnected ? "Reconectar" : "Conectar"}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API Google Sheets</Label>
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-gray-500" />
                <Input 
                  id="apiKey"
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="Sua chave de API do Google Sheets"
                  type="password"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Chave de API para acessar o Google Sheets
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentId">ID do Documento</Label>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-gray-500" />
                <Input 
                  id="documentId"
                  value={documentId} 
                  onChange={(e) => setDocumentId(e.target.value)} 
                  placeholder="ID do documento do Google Sheets"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                ID da planilha do Google Sheets (parte da URL após /d/)
              </p>
            </div>
          </div>
          
          {isConnected && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Testar Integração</h3>
                  <Button 
                    onClick={addTestProperty}
                    disabled={isLoading}
                    variant="secondary"
                    size="sm"
                  >
                    Adicionar Propriedade de Teste
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="mb-2 font-medium">Dados Existentes ({testData.length})</h4>
                  
                  {testData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum dado encontrado. Adicione uma propriedade de teste para começar.</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {testData.map((item, index) => (
                        <div key={index} className="p-2 border rounded text-sm">
                          <p><span className="font-medium">Nome:</span> {item.nome}</p>
                          <p><span className="font-medium">ID:</span> {item._id || item.id}</p>
                          <p><span className="font-medium">Tipo:</span> {item.tipoImovel}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="p-4 border rounded-lg bg-blue-50 text-blue-800">
            <h3 className="font-medium mb-2">Instruções:</h3>
            <ol className="list-decimal ml-5 space-y-1 text-sm">
              <li>Crie uma nova planilha no Google Sheets</li>
              <li>Obtenha o ID da planilha a partir da URL (após /d/ e antes de /edit)</li>
              <li>Configure o Sheets para permitir acesso de API (Compartilhar &gt; Avançado &gt; Qualquer pessoa com o link)</li>
              <li>Obtenha uma chave de API do Google Cloud Console para o Google Sheets API</li>
              <li>Insira a chave da API e o ID do documento acima e clique em Conectar</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
          {isConnected && (
            <Button onClick={() => window.location.href = "/properties"}>
              Ir para Empreendimentos
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoogleSheetsSetupPage;
