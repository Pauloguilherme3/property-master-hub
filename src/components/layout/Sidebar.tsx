
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Building,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  AlertCircle,
  LucideIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  submenu?: Omit<NavItem, "icon" | "submenu">[];
  roles?: UserRole[];
}

export function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const location = useLocation();
  const { hasPermission, isFirebaseInitialized } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  }, [location.pathname, closeSidebar]);

  // Auto-open submenu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    
    navItems.forEach(item => {
      if (item.submenu && item.submenu.some(subItem => currentPath === subItem.href)) {
        setOpenSubmenu(item.title);
      }
    });
  }, [location.pathname]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(prev => prev === title ? null : title);
  };

  const navItems: NavItem[] = [
    {
      title: "Início",
      href: "/",
      icon: Home
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Empreendimentos",
      href: "/empreendimentos",
      icon: Building,
      badge: "Novo",
      submenu: [
        { title: "Todos os Empreendimentos", href: "/empreendimentos" },
        { 
          title: "Adicionar Empreendimento", 
          href: "/empreendimentos/adicionar", 
          roles: [UserRole.GERENTE, UserRole.ADMINISTRADOR, UserRole.GERENTE_PRODUTO] 
        },
        { title: "Destaques", href: "/empreendimentos/destaques" },
        { title: "Mapa de Empreendimentos", href: "/empreendimentos/mapa" }
      ]
    },
    {
      title: "Reservas",
      href: "/reservas",
      icon: Calendar,
      submenu: [
        { title: "Todas as Reservas", href: "/reservas" },
        { title: "Visualização de Calendário", href: "/reservas/calendario" },
        { title: "Agendar Visitas", href: "/reservas/agendar" }
      ]
    },
    {
      title: "Corretores",
      href: "/corretores",
      icon: Users,
      submenu: [
        { title: "Todos os Corretores", href: "/corretores" },
        { 
          title: "Desempenho", 
          href: "/corretores/desempenho", 
          roles: [UserRole.GERENTE, UserRole.SUPERVISOR, UserRole.ADMINISTRADOR] 
        },
        { 
          title: "Atribuição de Leads", 
          href: "/corretores/leads", 
          roles: [UserRole.GERENTE, UserRole.SUPERVISOR, UserRole.ADMINISTRADOR] 
        }
      ],
      roles: [UserRole.CORRETOR, UserRole.GERENTE, UserRole.SUPERVISOR, UserRole.ADMINISTRADOR]
    },
    {
      title: "Clientes",
      href: "/clientes",
      icon: Users,
      roles: [UserRole.CORRETOR, UserRole.GERENTE, UserRole.SUPERVISOR, UserRole.ADMINISTRADOR]
    },
    {
      title: "Relatórios",
      href: "/relatorios",
      icon: FileText,
      roles: [UserRole.GERENTE, UserRole.SUPERVISOR, UserRole.GERENTE_PRODUTO, UserRole.ADMINISTRADOR]
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: [UserRole.GERENTE, UserRole.SUPERVISOR, UserRole.GERENTE_PRODUTO, UserRole.ADMINISTRADOR]
    },
    {
      title: "Configurações",
      href: "/configuracoes",
      icon: Settings,
      roles: [UserRole.ADMINISTRADOR]
    }
  ];

  // Function to safely filter nav items when Firebase is not initialized
  const getFilteredNavItems = () => {
    if (!isFirebaseInitialized) {
      // If Firebase is not initialized, only show Home and Login
      return navItems.filter(item => item.href === "/" || item.href === "/login");
    }
    
    return navItems.filter(item => {
      if (!item.roles) return true;
      try {
        return hasPermission(item.roles);
      } catch (error) {
        console.error("Error checking permissions:", error);
        return false;
      }
    });
  };

  const filteredNavItems = getFilteredNavItems();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-sidebar dark:bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            PropMaster
          </span>
        </Link>
      </div>
      
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">
          {!isFirebaseInitialized && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Firebase não foi inicializado. A funcionalidade será limitada.
              </AlertDescription>
            </Alert>
          )}
          
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.submenu && item.submenu.some(subItem => location.pathname === subItem.href));
              
              if (item.submenu) {
                const filteredSubmenu = isFirebaseInitialized && item.submenu.filter(subItem => {
                  if (!subItem.roles) return true;
                  try {
                    return hasPermission(subItem.roles);
                  } catch (error) {
                    console.error("Error checking submenu permissions:", error);
                    return false;
                  }
                });
                
                if (!filteredSubmenu || filteredSubmenu.length === 0) return null;
                
                const isSubmenuOpen = openSubmenu === item.title;
                
                return (
                  <Collapsible
                    key={item.title}
                    open={isSubmenuOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        onClick={() => toggleSubmenu(item.title)}
                      >
                        <item.icon size={20} className="mr-3 flex-shrink-0" />
                        <span className="flex-grow text-left">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className="ml-auto mr-2 px-1 bg-primary/10 text-primary border-primary/20"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight
                          size={16}
                          className={cn(
                            "flex-shrink-0 transition-transform duration-200",
                            isSubmenuOpen && "rotate-90"
                          )}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-9 mt-1 space-y-1">
                      {filteredSubmenu.map((subItem) => {
                        const isSubItemActive = location.pathname === subItem.href;
                        
                        return (
                          <Link
                            key={subItem.title}
                            to={subItem.href}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-md transition-colors",
                              isSubItemActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                          >
                            {subItem.title}
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
              
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon size={20} className="mr-3 flex-shrink-0" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="ml-auto px-1 bg-primary/10 text-primary border-primary/20"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
