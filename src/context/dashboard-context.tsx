"use client";

import React, { createContext, useContext, useState } from "react";

type DashboardStats = {
  totalUsers: number;
  totalTransactions: number;
  activeTransactions: number;
  totalCryptocurrencies: number;
  transactionChange: number;
  totalCryptocurrenciesChange: number;
  newUsers: number;
  newUsersChange: number;
  transactionsVolume: number;
  transactionsVolumeChange: number;
  completedTransactions: number;
  completedTransactionsChange: number;
  mostTradedCurrency: string;
  mostTradedCurrencyChange: number;
};

type DashboardContextType = {
  dashboardData: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchDashboardData = async () => {
    const now = Date.now();
    // Solo actualiza si han pasado más de 5 minutos desde la última actualización
    if (dashboardData && now - lastFetch < 300000) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Error al obtener datos del dashboard");
      }
      const data = await response.json();
      setDashboardData(data);
      setLastFetch(now);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error al obtener datos del dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider value={{ dashboardData, loading, error, fetchDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard debe usarse dentro de un DashboardProvider");
  }
  return context;
}
