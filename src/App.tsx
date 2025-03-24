
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Reservations from "./pages/Reservations";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Add page transition animation
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1">
        <Navbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />
        <main className="pt-16 min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <AppLayout>
                  <Index />
                </AppLayout>
              } 
            />
            <Route 
              path="/login" 
              element={<LoginPage />} 
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
              path="/properties" 
              element={
                <AppLayout>
                  <Properties />
                </AppLayout>
              } 
            />
            <Route 
              path="/properties/:id" 
              element={
                <AppLayout>
                  <PropertyDetail />
                </AppLayout>
              } 
            />
            <Route 
              path="/reservations" 
              element={
                <AppLayout>
                  <Reservations />
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
