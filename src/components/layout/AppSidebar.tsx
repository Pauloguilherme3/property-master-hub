
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Home,
  Building,
  Calendar,
  Users,
  FileText,
  BarChart3,
  UserCog,
  LucideIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export function AppSidebar() {
  const location = useLocation();
  const { hasPermission, isFirebaseInitialized } = useAuth();
  const { state } = useSidebar();

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
      title: "Administração",
      href: "/usuarios",
      icon: UserCog,
      roles: [UserRole.ADMINISTRADOR]
    },
    {
      title: "Empreendimentos",
      href: "/empreendimentos",
      icon: Building
    },
    {
      title: "Reservas",
      href: "/reservas",
      icon: Calendar
    },
    {
      title: "Corretores",
      href: "/corretores",
      icon: Users,
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
    }
  ];

  const getFilteredNavItems = () => {
    if (!isFirebaseInitialized) {
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-16 items-center justify-center">
          {state === "expanded" ? (
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                PropMaster
              </span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center justify-center">
              <span className="text-xl font-bold text-primary">P</span>
            </Link>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
