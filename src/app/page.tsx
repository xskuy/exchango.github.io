"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { DollarSign, Users, Activity, Coins } from "lucide-react"

const volumeData = [
  { name: "Ene", BTC: 4000, ETH: 2400, USD: 2400 },
  { name: "Feb", BTC: 3000, ETH: 1398, USD: 2210 },
  { name: "Mar", BTC: 2000, ETH: 9800, USD: 2290 },
  { name: "Abr", BTC: 2780, ETH: 3908, USD: 2000 },
  { name: "May", BTC: 1890, ETH: 4800, USD: 2181 },
  { name: "Jun", BTC: 2390, ETH: 3800, USD: 2500 },
  { name: "Jul", BTC: 3490, ETH: 4300, USD: 2100 },
]

const priceData = [
  { name: "Ene", BTC: 33000, ETH: 2200 },
  { name: "Feb", BTC: 35000, ETH: 2300 },
  { name: "Mar", BTC: 37000, ETH: 2400 },
  { name: "Abr", BTC: 36000, ETH: 2350 },
  { name: "May", BTC: 38000, ETH: 2500 },
  { name: "Jun", BTC: 40000, ETH: 2600 },
  { name: "Jul", BTC: 42000, ETH: 2700 },
]

export default function Dashboard() { 
  const [] = useState("overview")

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Analítica</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% respecto al mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volumen de Transacciones</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5,231,890</div>
                <p className="text-xs text-muted-foreground">
                  +15% respecto a la semana pasada
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transacciones Activas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +7% respecto a ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Criptomonedas Listadas</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">
                  +2 nuevas esta semana
                </p>
              </CardContent>
            </Card>
          </div>
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
                <CardDescription>
                  Evolución de precios de BTC y ETH en los últimos 7 meses
                </CardDescription>
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
                <CardTitle className="text-sm font-medium">
                  Nuevos Usuarios (Últimas 24h)
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 comparado con ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Volumen de Transacciones (24h)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,234,890</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% comparado con ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Transacciones Completadas (24h)
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% comparado con ayer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Criptomoneda Más Negociada
                </CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">BTC</div>
                <p className="text-xs text-muted-foreground">
                  45% del volumen total
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
      </Tabs>
    </div>
  )
}