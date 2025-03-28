
import { useEffect, useState } from "react";
import { driveService } from "@/services/driveService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, HardDrive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FileUpload } from "@/components/ui/FileUpload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DriveTestPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const connectToGoogleDrive = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await driveService.connect();
      setIsConnected(driveService.isConnected());
      
      // Load files on successful connection
      if (driveService.isConnected()) {
        loadFiles();
      }
      
      toast({
        title: "Conectado com sucesso",
        description: "A conexão com o Google Drive foi estabelecida.",
        variant: "default",
      });
    } catch (err) {
      console.error("Erro ao conectar ao Google Drive:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao conectar ao Google Drive");
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Google Drive. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      const filesList = await driveService.listFiles();
      setFiles(filesList);
    } catch (err) {
      console.error("Erro ao carregar arquivos:", err);
      toast({
        title: "Erro ao carregar arquivos",
        description: "Não foi possível listar os arquivos do Google Drive.",
        variant: "destructive",
      });
    }
  };
  
  const handleFileUploaded = (fileInfo: any) => {
    // Reload files list after upload
    loadFiles();
  };
  
  const handleDeleteFile = async (fileId: string) => {
    try {
      await driveService.deleteFile(fileId);
      toast({
        title: "Arquivo removido",
        description: "O arquivo foi removido com sucesso.",
      });
      loadFiles();
    } catch (err) {
      console.error("Erro ao remover arquivo:", err);
      toast({
        title: "Erro ao remover arquivo",
        description: "Não foi possível remover o arquivo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Check if already connected on component mount
    setIsConnected(driveService.isConnected());
    
    // If connected, load files
    if (driveService.isConnected()) {
      loadFiles();
    }
    
    // Cleanup on unmount
    return () => {
      if (driveService.isConnected()) {
        driveService.disconnect().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="container max-w-5xl py-10 animate-fade-in">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="mr-2 h-5 w-5" />
            Teste de Conexão Google Drive
          </CardTitle>
          <CardDescription>
            Verificação da conexão com o Google Drive para armazenamento de arquivos
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
              onClick={connectToGoogleDrive} 
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
        </CardContent>
      </Card>
      
      {isConnected && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload de Arquivos</CardTitle>
              <CardDescription>
                Faça upload de arquivos para o Google Drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onFileUploaded={handleFileUploaded}
                acceptedTypes="image/*,.pdf,.docx,.xlsx"
                maxSizeMB={10}
                buttonText="Clique para enviar um arquivo"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Arquivos no Google Drive</CardTitle>
              <CardDescription>
                Lista de arquivos armazenados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum arquivo encontrado. Faça o upload de um arquivo acima.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do arquivo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Data de criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell>{file.mimeType}</TableCell>
                        <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                        <TableCell>{new Date(file.createdTime).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(file.webViewLink, '_blank')}
                            >
                              Visualizar
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DriveTestPage;
