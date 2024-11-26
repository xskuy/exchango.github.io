import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/auth-options"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { type, amount, fromCurrency, toCurrency, exchangeRate } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Buscar o crear las monedas
    const [originCurrency, destinationCurrency] = await Promise.all([
      prisma.cryptocurrency.upsert({
        where: { symbol: fromCurrency },
        update: {},
        create: {
          symbol: fromCurrency,
          name: fromCurrency,
          marketValue: 0
        }
      }),
      prisma.cryptocurrency.upsert({
        where: { symbol: toCurrency },
        update: {},
        create: {
          symbol: toCurrency,
          name: toCurrency,
          marketValue: 0
        }
      })
    ])

    // Crear la transacción
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount.toString()),
        exchangeRate: parseFloat(exchangeRate.toString()),
        userId: user.id,
        originCurrencyId: originCurrency.id,
        destinationCurrencyId: destinationCurrency.id,
        date: new Date(),
        status: 'COMPLETED'
      },
      include: {
        originCurrency: true,
        destinationCurrency: true
      }
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error saving transaction:', error)
    return NextResponse.json(
      { error: 'Error al guardar la transacción' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: user.id,
        type: "COMPRA"
      },
      include: {
        originCurrency: true,
        destinationCurrency: true
      },
      orderBy: {
        date: 'desc'
      },
      take: 10
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Error al obtener el historial' },
      { status: 500 }
    )
  }
}
