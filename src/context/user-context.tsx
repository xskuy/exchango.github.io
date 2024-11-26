"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

// Definir la duración del caché (24 horas en milisegundos)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  transactions: any[];
  stats: {
    mostBoughtCurrency: [string, number];
    largestTransaction: any;
    monthlyOperations: number;
    favoriteConversion: [string, number];
  };
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (email: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("userData");
      const timestamp = localStorage.getItem("userDataTimestamp");

      if (cached && timestamp) {
        const now = Date.now();
        if (now - parseInt(timestamp) < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchUser = useCallback(
    async (email: string) => {
      if (user?.email === email && Date.now() - lastFetch < CACHE_DURATION) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error("Failed to fetch user");

        const userData = await response.json();
        setUser(userData);
        setLastFetch(Date.now());

        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userDataTimestamp", Date.now().toString());
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [user?.email, lastFetch]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = localStorage.getItem("userDataTimestamp");
      if (timestamp && Date.now() - parseInt(timestamp) > CACHE_DURATION) {
        localStorage.removeItem("userData");
        localStorage.removeItem("userDataTimestamp");
      }
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      fetchUser,
    }),
    [user, loading, error, fetchUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
