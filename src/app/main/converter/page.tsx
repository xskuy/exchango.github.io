"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner"

// Interfaces
type ExchangeRateResponse = {
  result: string;
  conversion_rates: {
    [key: string]: number;
  };
};

type HistoricalDataResponse = {
  result: string;
  conversion_rates: {
    [date: string]: {
      [currency: string]: number;
    };
  };
};

interface Conversion {
  id: number;
  amount: number;
  result: number;
  originCurrency: { symbol: string };
  destinationCurrency: { symbol: string };
  createdAt: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  exchangeRate: number;
  date: string;
  originCurrency: { symbol: string };
  destinationCurrency: { symbol: string };
}

export default function ConversorMonedas() {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [historicalData, setHistoricalData] = useState<unknown[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { data: session } = useSession();

  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "MXN", "BRL", "CLP"];

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(`/api/exchange-rate?from=${fromCurrency}&to=${toCurrency}`);
        const data: ExchangeRateResponse = await response.json();
        if (data.result === "success") {
          setExchangeRate(data.conversion_rates[toCurrency]);
        } else {
          console.error("Error fetching exchange rate:", data.result);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    const fetchHistoricalData = async () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const historicalRates = [];

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        try {
          const response = await fetch(`/api/historical-data?from=${fromCurrency}&to=${toCurrency}&date=${dateStr}`);
          const data = await response.json();
          if (data.result === "success") {
            historicalRates.push({
              date: data.date,
              rate: data.rate,
            });
          } else {
            console.error(`Error fetching data for ${dateStr}:`, data["error-type"]);
          }
        } catch (error) {
          console.error(`Error fetching data for ${dateStr}:`, error);
        }
      }

      historicalRates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setHistoricalData(historicalRates);
    };

    fetchExchangeRate();
    fetchHistoricalData();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      const numericAmount = parseFloat(amount) || 0;
      setConvertedAmount(numericAmount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  useEffect(() => {
    const fetchConversions = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/conversion');
          if (response.ok) {
            const data = await response.json();
            setConversions(data);
          }
        } catch (error) {
          console.error('Error fetching conversions:', error);
        }
      }
    };

    const fetchTransactions = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/transaction');
          if (response.ok) {
            const data = await response.json();
            setTransactions(data);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      }
    };

    fetchConversions();
    fetchTransactions();
  }, [session]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSaveConversion = async () => {
    if (!session?.user) {
      toast.error("Debes iniciar sesión para guardar conversiones");
      return;
    }

    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    try {
      const response = await fetch('/api/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numericAmount,
          fromCurrency,
          toCurrency,
          result: convertedAmount,
        }),
      });

      if (response.ok) {
        toast.success("Conversión guardada exitosamente");
        // Actualizar el historial
        const newConversion = await response.json();
        setConversions([newConversion, ...conversions]);
      } else {
        toast.error("Error al guardar la conversión");
      }
    } catch (error) {
      console.error('Error saving conversion:', error);
      toast.error("Error al guardar la conversión");
    }
  };

  const handlePurchase = async () => {
    if (!session?.user) {
      toast.error("Debes iniciar sesión para realizar compras");
      return;
    }

    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "COMPRA",
          amount: numericAmount,
          fromCurrency,
          toCurrency,
          exchangeRate: exchangeRate,
          result: convertedAmount,
        }),
      });

      if (response.ok) {
        const newTransaction = await response.json();
        // Actualizar el estado local inmediatamente
        setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
        toast.success("Compra realizada exitosamente");
      } else {
        toast.error("Error al realizar la compra");
      }
    } catch (error) {
      console.error('Error making purchase:', error);
      toast.error("Error al realizar la compra");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Conversor y Compra de Monedas</CardTitle>
          <CardDescription>
            Convierte y compra diferentes monedas usando tasas de cambio en tiempo real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAmount(value === "" ? "" : value);
                  }}
                  min="0"
                  step="any"
                  className="flex-grow"
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="icon" onClick={handleSwapCurrencies}>
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={convertedAmount !== null ? convertedAmount.toFixed(2) : ""}
                  readOnly
                  className="flex-grow"
                />
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {exchangeRate !== null && (
                <p className="text-sm text-gray-500 text-center">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </p>
              )}
              
              {/* Agregar botón de guardar */}
              <div className="flex space-x-2 mt-4">
                <Button 
                  onClick={handleSaveConversion}
                  variant="outline"
                  disabled={!convertedAmount}
                >
                  Guardar Conversión
                </Button>
                <Button 
                  onClick={handlePurchase}
                  disabled={!convertedAmount}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Comprar {toCurrency}
                </Button>
              </div>
            </div>
            <div className="h-64 md:h-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                  <YAxis domain={["auto", "auto"]} tickFormatter={(tick) => tick.toFixed(4)} />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    formatter={(value: number) => value.toFixed(4)}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historial de conversiones */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Historial Reciente</h3>
            <div className="space-y-2">
              {conversions.map((conversion) => (
                <div key={conversion.id} className="bg-white p-3 rounded shadow-sm">
                  <div className="flex justify-between text-sm">
                    <span>
                      {conversion.amount} {conversion.originCurrency.symbol} → 
                      {conversion.result} {conversion.destinationCurrency.symbol}
                    </span>
                    <span className="text-gray-500">
                      {new Date(conversion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historial de transacciones */}
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Historial de Compras</h3>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="bg-white p-3 rounded shadow-sm">
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">#{transaction.id}</span>
                      <span className="mx-2">
                        {transaction.amount} {transaction.originCurrency.symbol} → 
                        {(transaction.amount * transaction.exchangeRate).toFixed(2)} {transaction.destinationCurrency.symbol}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
