"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ConversionHistory() {
  const [history, ] = useState([
    { id: 1, date: "2023-05-01", from: "USD", to: "EUR", amount: 100, result: 85 },
    { id: 2, date: "2023-05-02", from: "EUR", to: "GBP", amount: 200, result: 170 },
    { id: 3, date: "2023-05-03", from: "BTC", to: "USD", amount: 1, result: 30000 },
  ])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Historial de Cambio</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="dateFrom">Desde</Label>
          <Input id="dateFrom" type="date" />
        </div>
        <div>
          <Label htmlFor="dateTo">Hasta</Label>
          <Input id="dateTo" type="date" />
        </div>
        <div>
          <Label htmlFor="currency">Moneda</Label>
          <Select>
            <option value="all">Todas</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="BTC">BTC</option>
          </Select>
        </div>
      </div>
      <Button>Filtrar</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>De</TableHead>
            <TableHead>A</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.from}</TableCell>
              <TableCell>{item.to}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
