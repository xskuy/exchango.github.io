"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation" // Añadido para redirecciones

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const { data: session, status } = useSession()
  const router = useRouter()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleSignOut = () => {
    signOut({ 
      callbackUrl: '/auth/login-page',
      redirect: true
    })
  }

  const menuItems = [
    { name: "Dashboard", href: "/main" },
    { name: "Gestión de Usuarios", href: "/main/users" },
    { name: "Conversor de Monedas", href: "/main/converter" },
    { name: "Historial de Cambio", href: "/main/history" },
    { name: "Gestión de Transacciones", href: "/main/transactions" },
    { name: "Reportes y Analítica", href: "/main/reports" },
    { name: "Agregar Criptomonedas", href: "/main/add-crypto" },
  ]

  // Redirigir si el estado de la sesión es "unauthenticated"
  if (status === "unauthenticated") {
    router.push("/auth/login-page")
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <aside className="hidden md:flex md:flex-col md:w-64 md:bg-muted">
        <div className="p-6">
          <h2 className="text-2xl font-bold">CryptoExchange</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-background border-b">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
