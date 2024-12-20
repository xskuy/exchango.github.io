"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";
import dynamic from "next/dynamic";
import CurrencyBuyer from "@/components/currency-buyer";
import DrawerConfirmation from "@/components/drawer-confirmation";
import { SecurityVerification } from "@/components/security-verification";
import { RecentTransactionsCard } from "@/components/recent-transactions-card";
import { useCurrency } from "@/context/currency-context";

// Importar ThemeToggle de forma dinámica
const ThemeToggle = dynamic(() => import("@/components/theme-toggle"), {
  ssr: false,
});

export default function ConversorMonedas() {
  const { processTransaction } = useCurrency();
  const {
    // Remover lastUpdate, loadTransactions, theme, setTheme
  } = useCurrency();
  const {
    // Remover setTheme
  } = useTheme();
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState<{
    amount: string;
    currency: string;
    exchangeRate: number;
  } | null>(null);
  const [showSecurity, setShowSecurity] = useState(false);
  const [securityData, setSecurityData] = useState<{
    amount: number;
    receivedAmount: number;
    currency: string;
    paymentMethod: string;
  } | null>(null);

  const handleShowDrawer = (data: { amount: string; currency: string; exchangeRate: number }) => {
    setDrawerData(data);
    setShowDrawer(true);
  };

  const handleFinalConfirmation = () => {
    if (!drawerData) return;

    setSecurityData({
      amount: parseFloat(drawerData.amount),
      receivedAmount: parseFloat(drawerData.amount) * drawerData.exchangeRate,
      currency: drawerData.currency,
      paymentMethod: "Saldo disponible",
    });

    setShowSecurity(true);
    setShowDrawer(false);
  };

  const handleSecuritySuccess = async () => {
    if (!drawerData) return;

    try {
      await processTransaction({
        amount: drawerData.amount,
        fromCurrency: "USD",
        toCurrency: drawerData.currency,
        exchangeRate: drawerData.exchangeRate,
      });

      setShowDrawer(false);
      setShowSecurity(false);
    } catch {
      // Manejar el error sin la variable
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Conversor de Monedas</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Formulario de conversión a todo el ancho */}
        <div className="w-full bg-background border-b">
          <div className="container mx-auto p-6">
            <CurrencyBuyer onShowDrawer={handleShowDrawer} />
          </div>
        </div>

        {/* Historial como card */}
        <div className="container mx-auto p-6">
          <div className="max-w-3xl mx-auto">
            <RecentTransactionsCard />
          </div>
        </div>

        {showDrawer && drawerData && (
          <DrawerConfirmation
            onClose={() => setShowDrawer(false)}
            onConfirm={handleFinalConfirmation}
            amount={drawerData.amount}
            currency={drawerData.currency}
            exchangeRate={drawerData.exchangeRate || 1}
            paymentMethod="Saldo disponible"
          />
        )}

        {showSecurity && securityData && (
          <SecurityVerification
            onClose={() => setShowSecurity(false)}
            onSuccess={handleSecuritySuccess}
            amount={securityData.amount}
            receivedAmount={securityData.receivedAmount}
            currency={securityData.currency}
            paymentMethod={securityData.paymentMethod}
          />
        )}
      </main>
    </div>
  );
}
