import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next"; // Asegúrate de importar desde "next-auth/next"
import ClientLayout from "./client-layout";
import { DashboardProvider } from "@/context/dashboard-context";
import { UserProvider } from "@/context/user-context";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login-page");
  }

  return (
    <UserProvider>
      <ClientLayout>
        <DashboardProvider>{children}</DashboardProvider>
      </ClientLayout>
    </UserProvider>
  );
}
