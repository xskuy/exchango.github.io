"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DrawerConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  currency: string;
  exchangeRate: number;
  paymentMethod: string;
}

export default function DrawerConfirmation({
  onClose,
  onConfirm,
  amount = "0",
  currency = "USD",
  exchangeRate = 1,
  paymentMethod = "Saldo disponible",
}: DrawerConfirmationProps) {
  // Validación de props
  if (!amount || !currency || !exchangeRate) {
    console.error("Missing required props in DrawerConfirmation", { amount, currency, exchangeRate });
    return null;
  }

  const baseAmount = parseFloat(amount) || 0;
  const fee = baseAmount * 0.005;
  const networkFee = 2.5;
  const total = baseAmount + fee + networkFee;
  const receivedAmount = baseAmount * exchangeRate;

  // Función para formatear números con seguridad
  const safeToFixed = (num: number | undefined, decimals: number = 2) => {
    if (typeof num !== "number" || isNaN(num)) return "0.00";
    return num.toFixed(decimals);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <h3 className="font-semibold">Resumen de compra</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Detalles principales */}
        <Card className="p-4 space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {safeToFixed(receivedAmount)} {currency}
            </div>
            <div className="text-sm text-muted-foreground">Recibirás</div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <span className="text-muted-foreground">Pagarás</span>
              <span className="text-right font-medium">${safeToFixed(baseAmount)} USD</span>

              <span className="text-muted-foreground">Tasa de cambio</span>
              <span className="text-right">
                1 {currency} = ${safeToFixed(exchangeRate, 3)}
              </span>

              <span className="text-muted-foreground">Método</span>
              <span className="text-right">{paymentMethod}</span>
            </div>
          </div>
        </Card>

        {/* Desglose de costos */}
        <div className="space-y-3">
          <h4 className="font-medium">Desglose de costos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto base</span>
              <span>${safeToFixed(baseAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comisión (0.5%)</span>
              <span>${safeToFixed(fee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarifa de red</span>
              <span>${safeToFixed(networkFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-medium">
              <span>Total a pagar</span>
              <span>${safeToFixed(total)}</span>
            </div>
          </div>
        </div>

        {/* Aviso */}
        <Alert variant="default" className="bg-blue-50 text-blue-800">
          <AlertDescription>
            La transacción se procesará usando la tasa de cambio vigente al momento de la confirmación.
          </AlertDescription>
        </Alert>
      </div>

      {/* Footer con botones */}
      <div className="border-t p-4 space-y-3">
        <Button className="w-full" onClick={onConfirm}>
          <Check className="w-4 h-4 mr-2" />
          Confirmar compra
        </Button>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
