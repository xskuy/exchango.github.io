"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, AlertCircle, RotateCw } from "lucide-react";
import { AVAILABLE_CURRENCIES } from "@/constants/currencies";
import { useCurrency } from "@/context/currency-context";

export default function CurrencyBuyer({
  onShowDrawer,
}: {
  onShowDrawer: (data: { amount: string; currency: string; exchangeRate: number }) => void;
}) {
  const {
    lastUpdate,
    getExchangeRate,
    balance,
    availablePaymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    loadTransactions,
  } = useCurrency();

  const [spendAmount, setSpendAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const loadExchangeRate = async () => {
      try {
        const rate = await getExchangeRate(targetCurrency);
        if (rate) {
          setExchangeRate(rate);
        } else {
          throw new Error("Tasa de cambio no disponible");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al obtener tasa de cambio");
      }
    };

    loadExchangeRate();
  }, [targetCurrency, getExchangeRate]);

  const calculateReceiveAmount = () => {
    const amount = parseFloat(spendAmount) || 0;
    return exchangeRate ? (amount * exchangeRate).toFixed(2) : "0.00";
  };

  const handleBuyConfirmation = () => {
    if (!spendAmount || parseFloat(spendAmount) <= 0) {
      toast.error("Por favor, ingresa un monto válido");
      return;
    }

    if (!exchangeRate) {
      toast.error("Tasa de cambio no disponible");
      return;
    }

    onShowDrawer({
      amount: spendAmount,
      currency: targetCurrency,
      exchangeRate: exchangeRate,
    });
  };

  const handleFinalConfirmation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: spendAmount,
          fromCurrency: "USD",
          toCurrency: targetCurrency,
          result: calculateReceiveAmount(),
          exchangeRate: exchangeRate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar la compra");
      }

      await loadTransactions();
      toast.success("Compra realizada con éxito");
      setSpendAmount("");
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error instanceof Error ? error.message : "Error al procesar la compra");
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full mb-6 shadow-lg">
      <CardHeader className="border-b">
        <CardTitle>Comprar Monedas</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-8">
          <div className="flex space-x-6">
            {/* Panel izquierdo */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label>Quiero gastar</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="text"
                    value={spendAmount}
                    onChange={(e) => setSpendAmount(e.target.value)}
                    className="pl-7 text-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Saldo disponible: {formatBalance(balance.amount)}</p>
              </div>

              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePaymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.value}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Panel derecho */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label>Recibirás aproximadamente</Label>
                <div className="text-2xl font-bold text-green-600">
                  {calculateReceiveAmount()} {targetCurrency}
                </div>
                <p className="text-sm text-muted-foreground">
                  Precio actual: 1 USD = {exchangeRate?.toFixed(4) || "..."} {targetCurrency}
                  <span className="ml-2 text-green-500">↑ 0.3%</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Moneda a comprar</Label>
                <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {AVAILABLE_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Alert variant="default" className="bg-blue-50 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Ten en cuenta</AlertTitle>
            <AlertDescription>El precio final puede variar debido a la volatilidad del mercado.</AlertDescription>
          </Alert>

          <Button
            className="w-full"
            size="lg"
            onClick={handleBuyConfirmation}
            disabled={isLoading || !spendAmount || parseFloat(spendAmount) <= 0}
          >
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Continuar"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
