
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
  LucideIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

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
  const { hasPermission } = useAuth();
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
      title: "Home",
      href: "/",
      icon: Home
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Properties",
      href: "/properties",
      icon: Building,
      badge: "New",
      submenu: [
        { title: "All Properties", href: "/properties" },
        { title: "Add Property", href: "/properties/add", roles: [UserRole.MANAGER, UserRole.ADMINISTRATOR, UserRole.PRODUCT_MANAGER] },
        { title: "Featured", href: "/properties/featured" },
        { title: "Property Map", href: "/properties/map" }
      ]
    },
    {
      title: "Reservations",
      href: "/reservations",
      icon: Calendar,
      submenu: [
        { title: "All Reservations", href: "/reservations" },
        { title: "Calendar View", href: "/reservations/calendar" },
        { title: "Schedule Visits", href: "/reservations/schedule" }
      ]
    },
    {
      title: "Agents",
      href: "/agents",
      icon: Users,
      submenu: [
        { title: "All Agents", href: "/agents" },
        { title: "Performance", href: "/agents/performance", roles: [UserRole.MANAGER, UserRole.SUPERVISOR, UserRole.ADMINISTRATOR] },
        { title: "Lead Assignment", href: "/agents/leads", roles: [UserRole.MANAGER, UserRole.SUPERVISOR, UserRole.ADMINISTRATOR] }
      ],
      roles: [UserRole.AGENT, UserRole.MANAGER, UserRole.SUPERVISOR, UserRole.ADMINISTRATOR]
    },
    {
      title: "Clients",
      href: "/clients",
      icon: Users,
      roles: [UserRole.AGENT, UserRole.MANAGER, UserRole.SUPERVISOR, UserRole.ADMINISTRATOR]
    },
    {
      title: "Reports",
      href: "/reports",
      icon: FileText,
      roles: [UserRole.MANAGER, UserRole.SUPERVISOR, UserRole.PRODUCT_MANAGER, UserRole.ADMINISTRATOR]
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: [UserRole.MANAGER, UserRole.SUPERVISOR, UserRole.PRODUCT_MANAGER, UserRole.ADMINISTRATOR]
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      roles: [UserRole.ADMINISTRATOR]
    }
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return hasPermission(item.roles);
  });

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
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.submenu && item.submenu.some(subItem => location.pathname === subItem.href));
              
              if (item.submenu) {
                const filteredSubmenu = item.submenu.filter(subItem => {
                  if (!subItem.roles) return true;
                  return hasPermission(subItem.roles);
                });
                
                if (filteredSubmenu.length === 0) return null;
                
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
