"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, DollarSign, Bitcoin, ArrowUpDown } from "lucide-react"

interface UserData {
  id: number
  name: string
  email: string
  role: string
  transactions: any[] // Puedes definir una interfaz más específica si lo necesitas
}

export default function Component() {
  const [activeTab, setActiveTab] = useState("populares")
  const [userData, setUserData] = useState<UserData | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user?email=${session.user.email}`)
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    fetchUserData()
  }, [session])

  const popularCurrencies = [
    { name: "Bitcoin", symbol: "BTC", price: "34,567.89", change: "+2.5%" },
    { name: "Ethereum", symbol: "ETH", price: "2,345.67", change: "-1.2%" },
    { name: "Dólar", symbol: "USD", price: "1.00", change: "0%" },
    { name: "Euro", symbol: "EUR", price: "1.18", change: "+0.3%" },
  ]

  const recentTransactions = [
    { from: "BTC", to: "USD", amount: "0.5 BTC", value: "$17,283.94" },
    { from: "ETH", to: "EUR", amount: "2 ETH", value: "€4,691.34" },
    { from: "USD", to: "BTC", amount: "$1,000", value: "0.029 BTC" },
  ]

  const formatTransaction = (transaction: any) => {
    return {
      from: transaction.originCurrency.symbol,
      to: transaction.destinationCurrency.symbol,
      amount: `${transaction.amount} ${transaction.originCurrency.symbol}`,
      value: `${(transaction.amount * transaction.exchangeRate).toFixed(2)} ${transaction.destinationCurrency.symbol}`
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-background text-foreground">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userData?.name || 'Usuario'} />
          <AvatarFallback>{userData?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{userData?.name || 'Cargando...'}</h1>
          <p className="text-muted-foreground">{userData?.email || 'Cargando...'}</p>
          <p className="text-sm text-muted-foreground">Rol: {userData?.role || 'USER'}</p>
          <div className="flex space-x-2 mt-2">
            <Button variant="outline" size="sm">Editar perfil</Button>
            <Button variant="outline" size="sm">Configuración</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monedas populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularCurrencies.map((currency) => (
                <div key={currency.symbol} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    {currency.symbol === "BTC" ? <Bitcoin className="w-5 h-5" /> : 
                     currency.symbol === "USD" || currency.symbol === "EUR" ? <DollarSign className="w-5 h-5" /> :
                     <ArrowUpDown className="w-5 h-5" />}
                    <span>{currency.name}</span>
                  </div>
                  <div className="text-right">
                    <div>${currency.price}</div>
                    <div className={currency.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                      {currency.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="populares">Populares</TabsTrigger>
                <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
              </TabsList>
              <TabsContent value="populares">
                <div className="h-[200px] mt-4 bg-muted rounded-lg flex items-center justify-center">
                  <BarChart className="w-16 h-16 text-muted-foreground" />
                </div>
              </TabsContent>
              <TabsContent value="transacciones">
                <div className="space-y-4 mt-4">
                  {userData?.transactions.map((transaction, index) => {
                    const formattedTx = formatTransaction(transaction)
                    return (
                      <div key={transaction.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{formattedTx.from} → {formattedTx.to}</div>
                          <div className="text-sm text-muted-foreground">{formattedTx.amount}</div>
                        </div>
                        <div className="text-right font-medium">{formattedTx.value}</div>
                      </div>
                    )
                  }) || <div>No hay transacciones recientes</div>}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gráfico de actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[100px] bg-muted rounded-lg flex items-center justify-center">
              {Array.from({ length: 52 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 m-0.5 bg-primary"
                  style={{
                    opacity: Math.random(),
                    height: `${Math.max(10, Math.random() * 40)}px`
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
