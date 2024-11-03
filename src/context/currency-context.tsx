"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  timestamp: string;
}

interface ExchangeRate {
  currency: string;
  rate: number;
  lastUpdated: Date;
}

interface PaymentMethod {
  id: string;
  name: string;
  value: string;
}

interface UserBalance {
  amount: number;
  currency: string;
}

interface CurrencyContextType {
  transactions: Transaction[];
  exchangeRates: ExchangeRate[];
  lastUpdate: string;
  isLoading: boolean;
  loadTransactions: () => Promise<void>;
  processTransaction: (data: TransactionData) => Promise<void>;
  getExchangeRate: (currency: string) => Promise<number>;
  updateExchangeRates: () => Promise<void>;
  balance: UserBalance;
  availablePaymentMethods: PaymentMethod[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  conversions: Conversion[];
}

interface TransactionData {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<UserBalance>({
    amount: 1234.56,
    currency: "USD",
  });
  const [availablePaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", name: "Saldo disponible", value: "balance" },
    { id: "2", name: "Tarjeta guardada", value: "card" },
    { id: "3", name: "Transferencia bancaria", value: "bank" },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("balance");
  const [conversions, setConversions] = useState<Conversion[]>([]);

  // Función para verificar si necesitamos actualizar las tasas
  const shouldUpdateRates = (lastUpdated: Date) => {
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastUpdated.getTime()) / 1000 / 60;
    return diffInMinutes > 5; // Actualizar si han pasado más de 5 minutos
  };

  // Obtener tasa de cambio (desde caché o API)
  const getExchangeRate = useCallback(
    async (currency: string) => {
      const cachedRate = exchangeRates.find((rate) => rate.currency === currency);

      if (cachedRate && !shouldUpdateRates(cachedRate.lastUpdated)) {
        return cachedRate.rate;
      }

      try {
        // Usar la API existente
        const response = await fetch(`/api/exchange-rate?from=USD&to=${currency}`);
        if (!response.ok) throw new Error("Error al obtener tasa de cambio");
        const data = await response.json();

        if (data.result === "success") {
          const rate = data.conversion_rates[currency];

          // Actualizar caché
          setExchangeRates((prev) => {
            const filtered = prev.filter((r) => r.currency !== currency);
            return [
              ...filtered,
              {
                currency,
                rate,
                lastUpdated: new Date(),
              },
            ];
          });

          return rate;
        } else {
          throw new Error(data["error-type"] || "Error al obtener tasa de cambio");
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return cachedRate?.rate || null;
      }
    },
    [exchangeRates]
  );

  // Actualizar todas las tasas de cambio
  const updateExchangeRates = async () => {
    try {
      const currencies = ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY"]; // Ajusta según tus necesidades
      const rates = await Promise.all(
        currencies.map(async (currency) => {
          const response = await fetch(`/api/exchange-rate?from=USD&to=${currency}`);
          const data = await response.json();
          return {
            currency,
            rate: data.result === "success" ? data.conversion_rates[currency] : null,
            lastUpdated: new Date(),
          };
        })
      );

      setExchangeRates(rates.filter((rate) => rate.rate !== null));
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error updating exchange rates:", error);
      toast.error("Error al actualizar tasas de cambio");
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch("/api/conversion");
      if (!response.ok) throw new Error("Error al cargar conversiones");
      const data = await response.json();
      setConversions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  // Cargar transacciones inicialmente
  useEffect(() => {
    loadTransactions();
  }, []);

  const processTransaction = async (transactionData: TransactionData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar la compra");
      }

      const newTransaction = await response.json();

      // Actualizar el estado local sin necesidad de recargar todo
      setTransactions((prev) => [newTransaction, ...prev]);

      toast.success("Compra realizada con éxito");
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error instanceof Error ? error.message : "Error al procesar la compra");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        transactions,
        exchangeRates,
        lastUpdate,
        isLoading,
        loadTransactions,
        processTransaction,
        getExchangeRate,
        updateExchangeRates,
        balance,
        availablePaymentMethods,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        conversions,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
