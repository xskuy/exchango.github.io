import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { amount, fromCurrency, toCurrency, result } = await request.json()

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

    // Crear la conversión
    const conversion = await prisma.conversion.create({
      data: {
        amount: parseFloat(amount),
        result: parseFloat(result),
        userId: user.id,
        originCurrencyId: originCurrency.id,
        destinationCurrencyId: destinationCurrency.id
      },
      include: {
        originCurrency: true,
        destinationCurrency: true
      }
    })

    return NextResponse.json(conversion)
  } catch (error) {
    console.error('Error saving conversion:', error)
    return NextResponse.json(
      { error: 'Error al guardar la conversión' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
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

    const conversions = await prisma.conversion.findMany({
      where: { userId: user.id },
      include: {
        originCurrency: true,
        destinationCurrency: true
      },
      orderBy: {
        id: 'desc'
      },
      take: 10
    })

    return NextResponse.json(conversions)
  } catch (error) {
    console.error('Error fetching conversions:', error)
    return NextResponse.json(
      { error: 'Error al obtener el historial' },
      { status: 500 }
    )
  }
}
