"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [result, setResult] = useState(null)

  const currencies = ["USD", "EUR", "GBP", "JPY", "BTC", "ETH"]

  const handleConvert = () => {
    // Aquí iría la lógica real de conversión
    setResult(parseFloat(amount) * 0.85)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Conversor de Monedas</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="amount">Cantidad</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ingrese la cantidad"
          />
        </div>
        <div>
          <Label htmlFor="fromCurrency">De</Label>
          <Select id="fromCurrency" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="toCurrency">A</Label>
          <Select id="toCurrency" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={handleConvert}>Convertir</Button>
        </div>
      </div>
      {result !== null && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-lg font-semibold">
            {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
          </p>
        </div>
      )}
    </div>
  )
}