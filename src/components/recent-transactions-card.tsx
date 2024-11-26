"use client";

import { useCurrency } from "@/context/currency-context";
import { ArrowDownLeft, ArrowUpRight, Clock, Info } from "lucide-react";

export function RecentTransactionsCard() {
  const { conversions } = useCurrency();

  const getTransactionIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "COMPLETED":
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      default:
        return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Historial Reciente</h3>
        <button className="text-sm text-blue-600 hover:underline">Ver todo el historial</button>
      </div>

      <div className="border rounded-lg divide-y">
        {conversions.map((conversion) => (
          <div key={conversion.id} className={`p-4 ${conversion.status === "PENDING" ? "bg-blue-50/50" : ""}`}>
            <div className="flex items-center gap-3">
              <div className={`${conversion.status === "PENDING" ? "bg-blue-100" : "bg-green-100"} p-2 rounded-full`}>
                {getTransactionIcon(conversion.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {conversion.status === "COMPLETED" ? "Compra completada" : "Compra en proceso"}
                  </span>
                  <span className={`text-sm ${getStatusStyle(conversion.status)} px-2 py-0.5 rounded`}>
                    {conversion.status === "COMPLETED" ? "Completada" : "Procesando"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{new Date(conversion.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {conversion.result.toFixed(2)} {/* Need to get currency symbol from somewhere */}
                </div>
                <div className="text-sm text-gray-600">
                  -{conversion.amount.toFixed(2)} {/* Need to get currency symbol from somewhere */}
                </div>
              </div>
            </div>
            {conversion.status === "PENDING" && (
              <div className="mt-3 text-sm text-blue-800 bg-blue-100/50 p-2 rounded flex items-center gap-2">
                <Info className="w-4 h-4" />
                Tu compra está siendo procesada y se completará en breve
              </div>
            )}
          </div>
        ))}

        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Total comprado (30d)</div>
              <div className="font-medium mt-1">
                {conversions
                  .filter((c) => c.status === "COMPLETED")
                  .reduce((sum, c) => sum + c.result, 0)
                  .toFixed(2)}{" "}
                EUR
              </div>
            </div>
            <div>
              <div className="text-gray-600">Precio promedio</div>
              <div className="font-medium mt-1">
                1 EUR ={" "}
                {(
                  conversions.filter((c) => c.status === "COMPLETED").reduce((sum, c) => sum + c.exchangeRate, 0) /
                    conversions.filter((c) => c.status === "COMPLETED").length || 0
                ).toFixed(3)}{" "}
                USD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
