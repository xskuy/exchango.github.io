"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2023-05-01", type: "Compra", amount: 100, currency: "USD", exchangeRate: 1 },
    { id: 2, date: "2023-05-02", type: "Venta", amount: 50, currency: "EUR", exchangeRate: 0.85 },
    { id: 3, date: "2023-05-03", type: "Compra", amount: 0.5, currency: "BTC", exchangeRate: 30000 },
  ])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Transacciones</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="dateFrom">Desde</Label>
          <Input id="dateFrom" type="date" />
        </div>
        <div>
          <Label htmlFor="dateTo">Hasta</Label>
          <Input id="dateTo" type="date" />
        </div>
        <div>
          <Label htmlFor="transactionType">Tipo</Label>
          <Select id="transactionType">
            <option value="all">Todos</option>
            <option value="buy">Compra</option>
            <option value="sell">Venta</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="currency">Moneda</Label>
          <Select id="currency">
            <option value="all">Todas</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BTC">BTC</option>
          </Select>
        </div>
      </div>
      <Button>Filtrar</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Moneda</TableHead>
            <TableHead>Tasa de Cambio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.currency}</TableCell>
              <TableCell>{transaction.exchangeRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}