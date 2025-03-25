
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { auth } from "@/config/firebase";
import { Link } from "react-router-dom";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { toast } = useToast();
  const isFirebaseInitialized = !!auth;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      setError(null);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Ocorreu um erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Entrar</CardTitle>
        <CardDescription>
          Digite suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirebaseInitialized && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Firebase Não Inicializado</AlertTitle>
            <AlertDescription>
              As chaves do Firebase podem estar faltando ou inválidas. Certifique-se de que seu repositório GitHub tenha as chaves secretas corretas configuradas.
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro no login</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all"
              disabled={isLoading || !isFirebaseInitialized}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/90 transition-colors interactive-link"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all"
              disabled={isLoading || !isFirebaseInitialized}
            />
          </div>
          <Button
            type="submit"
            className="w-full transition-all transform hover:translate-y-[-2px]"
            disabled={isLoading || !isFirebaseInitialized}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : "Entrar"}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Não tem uma conta?</span>{" "}
          <Link to="/registrar" className="text-primary hover:underline">Registre-se</Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          {isFirebaseInitialized ? (
            <span>Para testar o login com Firebase, crie uma conta no seu projeto Firebase e insira as credenciais aqui.</span>
          ) : (
            <span>Por favor, verifique se as chaves do Firebase estão corretamente configuradas nos secrets do GitHub.</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
