
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/AppSidebar";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PendingApproval from "./pages/PendingApproval";
import UserManagement from "./pages/UserManagement";
import Dashboard from "./pages/Dashboard";
import Empreendimentos from "./pages/Empreendimentos";
import EmpreendimentoDetalhe from "./pages/EmpreendimentoDetalhe";
import EmpreendimentoPersonalizado from "./pages/EmpreendimentoPersonalizado";
import EmpreendimentoMapa from "./pages/EmpreendimentoMapa";
import Reservas from "./pages/Reservas";
import Corretores from "./pages/Corretores";
import DesempenhoCorretores from "./pages/DesempenhoCorretores";
import Unidades from "./pages/Unidades";
import ReservaFormulario from "./pages/ReservaFormulario";
import Clientes from "./pages/Clientes";
import RelatoriosAnalises from "./pages/RelatoriosAnalises";
import LeadsManagement from "./pages/LeadsManagement";
import Properties from "./pages/Properties";
import SheetsTest from "./pages/SheetsTest";
import DriveTest from "./pages/DriveTest";
import { CreatePropertyModal } from "./components/modals/CreatePropertyModal";

const queryClient = new QueryClient();

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);
    }
  }, [isFirstMount]);

  return (
    <div
      key={location.pathname}
      className={isFirstMount ? "" : "animate-fade-in"}
    >
      {children}
    </div>
  );
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                PropMaster
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route 
                path="/login" 
                element={<LoginPage />} 
              />
              <Route 
                path="/registrar" 
                element={<RegisterPage />} 
              />
              <Route 
                path="/registro-pendente" 
                element={<PendingApproval />} 
              />
              <Route 
                path="/" 
                element={
                  <AppLayout>
                    <Index />
                  </AppLayout>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                } 
              />
              <Route 
                path="/sheets-test" 
                element={
                  <AppLayout>
                    <SheetsTest />
                  </AppLayout>
                } 
              />
              <Route 
                path="/drive-test" 
                element={
                  <AppLayout>
                    <DriveTest />
                  </AppLayout>
                } 
              />
              <Route 
                path="/usuarios" 
                element={
                  <AppLayout>
                    <UserManagement />
                  </AppLayout>
                } 
              />
              <Route 
                path="/empreendimentos" 
                element={
                  <AppLayout>
                    <Empreendimentos />
                  </AppLayout>
                } 
              />
              <Route 
                path="/properties" 
                element={
                  <AppLayout>
                    <Properties />
                  </AppLayout>
                } 
              />
              <Route 
                path="/empreendimentos/:id" 
                element={
                  <AppLayout>
                    <EmpreendimentoDetalhe />
                  </AppLayout>
                } 
              />
              <Route 
                path="/e/:id" 
                element={<EmpreendimentoPersonalizado />} 
              />
              <Route 
                path="/empreendimentos/mapa" 
                element={
                  <AppLayout>
                    <EmpreendimentoMapa />
                  </AppLayout>
                } 
              />
              <Route 
                path="/unidades" 
                element={
                  <AppLayout>
                    <Unidades />
                  </AppLayout>
                } 
              />
              <Route 
                path="/unidades/:id/reserva" 
                element={
                  <AppLayout>
                    <ReservaFormulario />
                  </AppLayout>
                } 
              />
              <Route 
                path="/reservas" 
                element={
                  <AppLayout>
                    <Reservas />
                  </AppLayout>
                } 
              />
              <Route 
                path="/corretores" 
                element={
                  <AppLayout>
                    <Corretores />
                  </AppLayout>
                } 
              />
              <Route 
                path="/corretores/desempenho" 
                element={
                  <AppLayout>
                    <DesempenhoCorretores />
                  </AppLayout>
                } 
              />
              <Route 
                path="/clientes" 
                element={
                  <AppLayout>
                    <Clientes />
                  </AppLayout>
                } 
              />
              <Route 
                path="/leads" 
                element={
                  <AppLayout>
                    <LeadsManagement />
                  </AppLayout>
                } 
              />
              <Route 
                path="/relatorios" 
                element={
                  <AppLayout>
                    <RelatoriosAnalises />
                  </AppLayout>
                } 
              />
              <Route 
                path="/google-sheets-test" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SheetsTest />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/properties/new" 
                element={
                  <AppLayout>
                    <CreatePropertyModal isOpen={true} onClose={() => {}} />
                  </AppLayout>
                } 
              />
              <Route 
                path="*" 
                element={
                  <AppLayout>
                    <NotFound />
                  </AppLayout>
                } 
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
