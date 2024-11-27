"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, Send, RefreshCw, LogOut, ChevronRight } from "lucide-react";

interface Transaction {
  date: string;
  // Add other transaction properties as needed
}

interface UserData {
  id: number;
  name: string;
  email: string;
  walletId: string;
  wallet: {
    balance: number;
  };
  transactions: Transaction[];
  stats?: {
    mostBoughtCurrency?: [string, number];
    largestTransaction?: {
      amount: number;
      originCurrency: {
        symbol: string;
      };
    };
  };
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/user?email=${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

  const copyWalletId = () => {
    if (userData?.walletId) {
      navigator.clipboard.writeText(userData.walletId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <div className="flex gap-2">
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100" onClick={() => window.location.reload()}>
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-600">{userData.name[0]}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-gray-500">{userData.email}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Wallet ID</p>
                  <p className="font-mono">{userData.walletId}</p>
                </div>
                <button type="button" className="p-2 hover:bg-gray-200 rounded-full" onClick={copyWalletId}>
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-blue-600 rounded-lg text-white mb-6">
              <p className="text-sm opacity-90">Saldo actual</p>
              <p className="text-4xl font-bold mt-1">${userData.wallet.balance.toFixed(2)}</p>
              <p className="text-sm mt-2 opacity-75">
                Última actividad:{" "}
                {userData.transactions[0]?.date
                  ? new Date(userData.transactions[0].date).toLocaleString()
                  : "Sin actividad"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-lg hover:bg-gray-800"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recargar</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Estadísticas</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Cripto más comprada</p>
                  <p className="text-sm text-gray-500">{userData.stats?.mostBoughtCurrency?.[0] || "-"}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">Mayor transacción</p>
                  <p className="text-sm text-gray-500">
                    {userData.stats?.largestTransaction
                      ? `${userData.stats.largestTransaction.amount} ${userData.stats.largestTransaction.originCurrency.symbol}`
                      : "-"}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
