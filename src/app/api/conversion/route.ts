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
    const body = await request.json()
    console.log('Body recibido:', body)

    const { amount, fromCurrency, toCurrency, exchangeRate } = body

    // Validaciones iniciales
    if (!amount || !fromCurrency || !toCurrency || !exchangeRate) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Calcular el resultado
    const parsedAmount = parseFloat(amount)
    const parsedExchangeRate = parseFloat(exchangeRate)
    const calculatedResult = parsedAmount * parsedExchangeRate

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
        amount: parsedAmount,
        result: calculatedResult, // Usar el resultado calculado
        exchangeRate: parsedExchangeRate,
        status: "COMPLETED",
        fee: 0,
        userId: user.id,
        originCurrencyId: originCurrency.id,
        destinationCurrencyId: destinationCurrency.id
      }
    })

    // Obtener la conversión con las relaciones
    const conversionWithRelations = await prisma.conversion.findUnique({
      where: { id: conversion.id },
      include: {
        originCurrency: true,
        destinationCurrency: true
      }
    })

    return NextResponse.json(conversionWithRelations)

  } catch (error) {
    console.error('Error detallado:', error)
    return NextResponse.json(
      { 
        error: 'Error al procesar la conversión',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
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
