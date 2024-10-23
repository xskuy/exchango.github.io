"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Puedes agregar estos tipos si lo deseas para mejorar la seguridad de tipos
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

export default function ConversorMonedas() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [historicalData, setHistoricalData] = useState<unknown[]>([]);

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
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Conversor de Monedas</CardTitle>
          <CardDescription>Convierte entre diferentes monedas usando tasas de cambio en tiempo real.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
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
        </CardContent>
      </Card>
    </div>
  );
}
