
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { auth } from "@/config/firebase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const isFirebaseInitialized = !!auth;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      // Toast is already shown in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access the Real Estate CRM
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirebaseInitialized && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Firebase Not Initialized</AlertTitle>
            <AlertDescription>
              GitHub Actions secret keys may be missing or invalid. Make sure your GitHub repository has the correct secret keys configured.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all"
              disabled={!isFirebaseInitialized}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/90 transition-colors interactive-link"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all"
              disabled={!isFirebaseInitialized}
            />
          </div>
          <Button
            type="submit"
            className="w-full transition-all transform hover:translate-y-[-2px]"
            disabled={isLoading || !isFirebaseInitialized}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          {isFirebaseInitialized ? (
            <span>To test Firebase login, create an account in your Firebase project and enter the credentials here.</span>
          ) : (
            <span>Por favor, verifique se as chaves do Firebase estão corretamente configuradas nos secrets do GitHub.</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
