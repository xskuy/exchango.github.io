"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { DollarSign, Users, Activity, Coins, ArrowUpRight, ArrowDownLeft, Bitcoin } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import "../style/page.css";
import { useUser } from "@/context/user-context";
import { useDashboard } from "@/context/dashboard-context";

const volumeData = [
  { name: "Ene", BTC: 4000, ETH: 2400, USD: 2400 },
  { name: "Feb", BTC: 3000, ETH: 1398, USD: 2210 },
  { name: "Mar", BTC: 2000, ETH: 9800, USD: 2290 },
  { name: "Abr", BTC: 2780, ETH: 3908, USD: 2000 },
  { name: "May", BTC: 1890, ETH: 4800, USD: 2181 },
  { name: "Jun", BTC: 2390, ETH: 3800, USD: 2500 },
  { name: "Jul", BTC: 3490, ETH: 4300, USD: 2100 },
];

const priceData = [
  { name: "Ene", BTC: 33000, ETH: 2200 },
  { name: "Feb", BTC: 35000, ETH: 2300 },
  { name: "Mar", BTC: 37000, ETH: 2400 },
  { name: "Abr", BTC: 36000, ETH: 2350 },
  { name: "May", BTC: 38000, ETH: 2500 },
  { name: "Jun", BTC: 40000, ETH: 2600 },
  { name: "Jul", BTC: 42000, ETH: 2700 },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const { user, loading: userLoading, fetchUser } = useUser();
  const { dashboardData, loading: dashboardLoading } = useDashboard();

  useEffect(() => {
    if (!session?.user?.email) return;

    if (!user) {
      fetchUser(session.user.email);
    }
  }, [session?.user?.email, user, fetchUser]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const balance = user?.balance || 0;
  const transactions = user?.transactions || [];

  return !user || userLoading ? (
    <div className="flex-1 flex justify-center items-center w-full h-full" suppressHydrationWarning>
      <div className="loader" />
    </div>
  ) : (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {getGreeting()},{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {user.name}
          </span>
        </h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Analítica</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.totalUsers || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.totalTransactions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dashboardData?.transactionChange || 0) > 0 ? "+" : ""}
                  {(dashboardData?.transactionChange || 0).toFixed(1)}% respecto a ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transacciones Activas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.activeTransactions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dashboardData?.transactionChange || 0) > 0 ? "+" : ""}
                  {(dashboardData?.transactionChange || 0).toFixed(1)}% respecto a ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Criptomonedas Listadas</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.totalCryptocurrencies || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dashboardData?.totalCryptocurrenciesChange ?? 0) > 0 ? "+" : ""}
                  {(dashboardData?.totalCryptocurrenciesChange ?? 0).toFixed(1)}% respecto a la semana pasada
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Mi Wallet</CardTitle>
                <CardDescription>Dashboard de tu billetera digital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">${balance.toFixed(2)}</div>
                <div className="mt-4 flex space-x-2">
                  <Button className="flex-1">
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Enviar
                  </Button>
                  <Button className="flex-1">
                    <ArrowDownLeft className="mr-2 h-4 w-4" /> Recibir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-6 w-6" />
                      <span>USD</span>
                    </div>
                    <span>${balance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bitcoin className="mr-2 h-6 w-6" />
                      <span>BTC</span>
                    </div>
                    <span>0.0135 BTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="mr-2 h-6 w-6" />
                      <span>ETH</span>
                    </div>
                    <span>0.25 ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {transaction.type === "DEPOSIT" || transaction.type === "TRANSFER" ? (
                        <ArrowDownLeft className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">
                          {transaction.type === "DEPOSIT"
                            ? "Depósito"
                            : transaction.type === "WITHDRAWAL"
                            ? "Retiro"
                            : transaction.type === "EXCHANGE"
                            ? "Intercambio"
                            : "Transferencia"}{" "}
                          {transaction.description && `- ${transaction.description}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      {transaction.type === "DEPOSIT" ? "+" : "-"}
                      {transaction.amount} {transaction.originCurrency.symbol}
                      {transaction.type === "EXCHANGE" && (
                        <span className="text-sm text-muted-foreground">
                          {" → "}
                          {transaction.exchangeRate * transaction.amount} {transaction.destinationCurrency.symbol}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full">
                Ver todas las transacciones
              </Button>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Volumen de Transacciones</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    BTC: {
                      label: "Bitcoin",
                      color: "hsl(var(--chart-1))",
                    },
                    ETH: {
                      label: "Ethereum",
                      color: "hsl(var(--chart-2))",
                    },
                    USD: {
                      label: "USD",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="BTC" fill="var(--color-BTC)" />
                      <Bar dataKey="ETH" fill="var(--color-ETH)" />
                      <Bar dataKey="USD" fill="var(--color-USD)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Precios de Criptomonedas</CardTitle>
                <CardDescription>Evolución de precios de BTC y ETH en los últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    BTC: {
                      label: "Bitcoin",
                      color: "hsl(var(--chart-1))",
                    },
                    ETH: {
                      label: "Ethereum",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="BTC" stroke="var(--color-BTC)" />
                      <Line type="monotone" dataKey="ETH" stroke="var(--color-ETH)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos Usuarios (Últimas 24h)</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.newUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dashboardData?.newUsersChange ?? 0) > 0 ? "+" : ""}
                  {(dashboardData?.newUsersChange ?? 0).toFixed(1)}% respecto a ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volumen de Transacciones (24h)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.transactionsVolume || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dashboardData?.transactionsVolumeChange ?? 0) > 0 ? "+" : ""}
                  {(dashboardData?.transactionsVolumeChange ?? 0).toFixed(1)}% respecto a ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transacciones Completadas (24h)</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.completedTransactions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dashboardData?.completedTransactionsChange ?? 0) > 0 ? "+" : ""}
                  {(dashboardData?.completedTransactionsChange ?? 0).toFixed(1)}% respecto a ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Criptomoneda Más Negociada</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardLoading ? "Cargando..." : dashboardData?.mostTradedCurrency || ""}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dashboardData?.mostTradedCurrencyChange ?? 0) > 0 ? "+" : ""}
                  {(dashboardData?.mostTradedCurrencyChange ?? 0).toFixed(1)}% respecto a la semana pasada
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Análisis de Volumen por Criptomoneda</CardTitle>
              <CardDescription>
                Comparativa de volúmenes de transacción entre las principales criptomonedas
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  BTC: {
                    label: "Bitcoin",
                    color: "hsl(var(--chart-1))",
                  },
                  ETH: {
                    label: "Ethereum",
                    color: "hsl(var(--chart-2))",
                  },
                  USD: {
                    label: "USD",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="BTC" stroke="var(--color-BTC)" strokeWidth={2} />
                    <Line type="monotone" dataKey="ETH" stroke="var(--color-ETH)" strokeWidth={2} />
                    <Line type="monotone" dataKey="USD" stroke="var(--color-USD)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wallet" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Mi Wallet</CardTitle>
                <CardDescription>Dashboard de tu billetera digital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">${balance.toFixed(2)}</div>
                <div className="mt-4 flex space-x-2">
                  <Button className="flex-1">
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Enviar
                  </Button>
                  <Button className="flex-1">
                    <ArrowDownLeft className="mr-2 h-4 w-4" /> Recibir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-6 w-6" />
                      <span>USD</span>
                    </div>
                    <span>${balance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bitcoin className="mr-2 h-6 w-6" />
                      <span>BTC</span>
                    </div>
                    <span>0.0135 BTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="mr-2 h-6 w-6" />
                      <span>ETH</span>
                    </div>
                    <span>0.25 ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {transaction.type === "DEPOSIT" || transaction.type === "TRANSFER" ? (
                        <ArrowDownLeft className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">
                          {transaction.type === "DEPOSIT"
                            ? "Depósito"
                            : transaction.type === "WITHDRAWAL"
                            ? "Retiro"
                            : transaction.type === "EXCHANGE"
                            ? "Intercambio"
                            : "Transferencia"}{" "}
                          {transaction.description && `- ${transaction.description}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      {transaction.type === "DEPOSIT" ? "+" : "-"}
                      {transaction.amount} {transaction.originCurrency.symbol}
                      {transaction.type === "EXCHANGE" && (
                        <span className="text-sm text-muted-foreground">
                          {" → "}
                          {transaction.exchangeRate * transaction.amount} {transaction.destinationCurrency.symbol}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full">
                Ver todas las transacciones
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
