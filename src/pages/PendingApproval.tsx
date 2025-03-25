
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Clock, Home } from "lucide-react";

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="container max-w-screen-xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            PropMaster
          </span>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Clock className="h-16 w-16 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">Cadastro Pendente</CardTitle>
            <CardDescription>
              Seu cadastro foi recebido e está aguardando aprovação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Obrigado por se cadastrar! Um administrador irá analisar seu cadastro em breve.
              Você receberá uma notificação por email quando seu cadastro for aprovado.
            </p>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2">O que acontece agora?</h3>
              <ul className="text-sm text-amber-700 text-left list-disc pl-5 space-y-1">
                <li>Um administrador irá revisar suas informações</li>
                <li>Após a aprovação, você receberá um email</li>
                <li>Você poderá então fazer login no sistema</li>
                <li>Em caso de dúvidas, entre em contato com o suporte</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Voltar para a Página Inicial
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} PropMaster. All rights reserved.
      </footer>
    </div>
  );
};

export default PendingApproval;
