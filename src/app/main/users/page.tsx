"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowUpRight,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  HelpCircle,
  LogOut,
  QrCode,
  Search,
  Send,
  Settings,
  Copy,
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  walletId: string;
  status: string;
  wallet: {
    id: number;
    balance: number;
  };
  transactions: any[];
  stats?: {
    mostBoughtCurrency?: [string, number];
    largestTransaction?: {
      amount: number;
      originCurrency: {
        symbol: string;
      };
      date: string;
    };
    monthlyOperations?: number;
    favoriteConversion?: [string, number];
  };
}

const formatWalletId = (walletId: string) => {
  const lastTwelveChars = walletId.slice(-12);
  const maskedPart = "•".repeat(walletId.length - 12);
  return `${maskedPart}${lastTwelveChars}`;
};

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/user?email=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>No se pudo cargar la información del usuario.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const copyWalletId = () => {
    if (userData?.walletId) {
      navigator.clipboard.writeText(userData.walletId);
    }
  };

  const formatTransaction = (transaction: any) => {
    return {
      title:
        transaction.type === "DEPOSIT" ? "Recarga" : transaction.type === "WITHDRAWAL" ? "Retiro" : "Transferencia",
      amount: transaction.amount,
      symbol: transaction.originCurrency.symbol,
      date: new Date(transaction.date).toLocaleDateString(),
      type: transaction.type,
      isPositive: transaction.type === "DEPOSIT",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => window.location.reload()}>
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-600">{userData.name[0]}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
                <div className="flex items-center mt-2">
                  <p className="text-sm mr-2">
                    Wallet ID: {userData?.walletId ? formatWalletId(userData.walletId) : "•••••••"}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={copyWalletId}
                    title="Copiar Wallet ID"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo actual</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {showBalance ? `$${userData.wallet.balance.toFixed(2) || "0.00"}` : "••••••"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Última actividad:{" "}
                  {userData.transactions[0]?.date
                    ? new Date(userData.transactions[0].date).toLocaleString()
                    : "Sin actividad"}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button className="w-full">
                <Send className="mr-2 h-5 w-5" /> Enviar
              </Button>
              <Button variant="outline" className="w-full">
                <ArrowUpRight className="mr-2 h-5 w-5" /> Recargar
              </Button>
            </div>

            <div className="p-6 bg-blue-600 rounded-lg text-white mb-6">
              <p className="text-sm opacity-90">Saldo actual</p>
              <p className="text-4xl font-bold mt-1">${userData.wallet.balance.toFixed(2)}</p>
              <p className="text-sm mt-2 opacity-75">
                Última actividad:{" "}
                {userData.transactions[0]?.date
                  ? new Date(userData.transactions[0].date).toLocaleString()
                  : "Sin actividad"}
              </p>
            </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.stats?.mostBoughtCurrency && (
                    <div>
                      <p className="text-sm font-medium">Cripto más comprada</p>
                      <p className="text-2xl">{userData.stats.mostBoughtCurrency[0]}</p>
                    </div>
                  )}
                  {userData.stats?.monthlyOperations && (
                    <div>
                      <p className="text-sm font-medium">Operaciones mensuales</p>
                      <p className="text-2xl">{userData.stats.monthlyOperations}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mayor transacción</CardTitle>
              </CardHeader>
              <CardContent>
                {userData.stats?.largestTransaction && (
                  <div>
                    <p className="text-2xl font-bold">
                      {userData.stats.largestTransaction.amount}
                      {userData.stats.largestTransaction.originCurrency.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(userData.stats.largestTransaction.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de transacciones</CardTitle>
                <CardDescription>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar transacciones" />
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="month">Este mes</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {userData.transactions.map((transaction, index) => {
                    const formattedTx = formatTransaction(transaction);
                    return (
                      <li key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{formattedTx.title}</p>
                          <p className="text-sm text-muted-foreground">{formattedTx.date}</p>
                        </div>
                        <span className={formattedTx.isPositive ? "text-green-500" : "text-red-500"}>
                          {formattedTx.isPositive ? "+" : "-"}
                          {formattedTx.amount} {formattedTx.symbol}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa">Autenticación de dos factores (2FA)</Label>
                  <Switch id="2fa" />
                </div>
                <Button variant="outline" className="w-full">
                  Cambiar contraseña
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opciones de cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notificaciones</Label>
                  <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar/Respaldar wallet
                </Button>
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Administrar tarjetas
                </Button>
                <Button variant="outline" className="w-full">
                  <QrCode className="mr-2 h-4 w-5" />
                  Mi código QR
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <Button variant="ghost" className="text-destructive" onClick={() => signOut()}>
            <LogOut className="mr-2 h-5 w-5" /> Cerrar sesión
          </Button>
        </div>
      </footer>
    </div>
  );
}
