import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next" // Asegúrate de importar desde "next-auth/next"
import ClientLayout from "./client-layout"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/login-page')
  }

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
}
