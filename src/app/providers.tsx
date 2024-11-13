"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/context/user-context";
import { CurrencyProvider } from "@/context/currency-context";

import { SidebarProvider } from "@/context/sidebar-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <UserProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </UserProvider>
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
