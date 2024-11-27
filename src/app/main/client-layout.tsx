"use client";

import type * as React from "react";
import { Home, Users, DollarSign, Settings2, LogOut, ChevronsUpDown, ChevronRight, Moon, Sun } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useUser } from "@/context/user-context";
import { useEffect } from "react";
import { redirect } from "next/navigation";

// Datos de navegación
const navItems = [
  {
    title: "Dashboard",
    url: "/main",
    icon: Home,
    isActive: true,
  },
  {
    title: "Converter",
    url: "/main/converter",
    icon: DollarSign,
  },
  {
    title: "Transacciones",
    url: "/main/transactions",
    icon: DollarSign,
  },
  {
    title: "Configuración",
    url: "/main/settings",
    icon: Settings2,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user, loading, fetchUser } = useUser();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && !user?.email) {
      fetchUser(session.user.email);
    }
  }, [status, session?.user?.email, user?.email, fetchUser]);

  if (status === "loading" || (status === "authenticated" && loading && !user)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  const handleSignOut = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userDataTimestamp");
    await signOut({
      callbackUrl: "/auth/login-page",
    });
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Crypto Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || session?.user?.image || ""}
                        alt={user?.name || session?.user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.[0] || session?.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || session?.user?.name || "Usuario"}</span>
                      <span className="truncate text-xs">{user?.email || session?.user?.email || ""}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  {console.log("User role:", user?.role)}
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/main/users" className="flex items-center w-full">
                        <Users className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuGroup>
                  {(user?.role === "admin" || user?.role === "ADMIN") && (
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/main/users" className="flex items-center w-full">
                          <Users className="mr-2 h-4 w-4" />
                          Gestionar Usuarios
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </DropdownMenuGroup>
                  )}
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Settings2 className="mr-2 h-4 w-4" />
                      Configuración
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Modo claro
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Modo oscuro
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="flex-1">{children}</div>
    </SidebarProvider>
  );
}
