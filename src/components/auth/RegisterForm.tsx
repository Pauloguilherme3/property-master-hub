
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isFirebaseInitialized } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isFirebaseInitialized) {
      toast({
        variant: "destructive",
        title: "Erro no servidor",
        description: "O serviço de autenticação não está disponível no momento."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await register(values.email, values.password, values.name);
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Seu cadastro foi recebido e está aguardando aprovação por um administrador."
      });
      
      navigate("/registro-pendente");
    } catch (error: any) {
      console.error("Erro no registro:", error);
      
      let errorMessage = "Ocorreu um erro ao tentar registrar o usuário.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está sendo utilizado por outro usuário.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border shadow-sm">
      <div>
        <h2 className="text-2xl font-bold">Criar uma conta</h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

      {!isFirebaseInitialized && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            O serviço de autenticação não está disponível no momento. Por favor, tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Digite seu email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme sua senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha novamente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Já possui uma conta?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
            Faça login
          </Button>
        </p>
      </div>
    </div>
  );
}
