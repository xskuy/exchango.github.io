import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  console.log('API /user - Request for email:', email)

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    // Obtener el primer día del mes actual
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        transactions: {
          include: {
            originCurrency: true,
            destinationCurrency: true,
          },
          orderBy: {
            date: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calcular estadísticas
    const stats = {
      mostBoughtCurrency: calculateMostBoughtCurrency(user.transactions),
      largestTransaction: findLargestTransaction(user.transactions),
      monthlyOperations: user.transactions.filter(t => 
        new Date(t.date) >= startOfMonth
      ).length,
      favoriteConversion: calculateFavoriteConversion(user.transactions)
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletId: user.walletId,
      status: user.status,
      wallet: {
        id: user.wallet?.id,
        balance: user.wallet?.balance || 0,
      },
      transactions: user.transactions.slice(0, 5), // Solo las últimas 5 transacciones
      stats: stats
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Error fetching user data' },
      { status: 500 }
    )
  }
}

function calculateMostBoughtCurrency(transactions: any[]) {
  if (!transactions.length) return ['-', 0]
  
  const currencyCounts = transactions.reduce((acc, t) => {
    const currency = t.destinationCurrency.symbol
    acc[currency] = (acc[currency] || 0) + 1
    return acc
  }, {})

  const sortedCurrencies = Object.entries(currencyCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))

  return sortedCurrencies[0] || ['-', 0]
}

function findLargestTransaction(transactions: any[]) {
  if (!transactions.length) return null
  
  return transactions.reduce((largest, t) => {
    const amount = t.amount * t.exchangeRate
    return amount > (largest?.amount || 0) ? t : largest
  }, null)
}

function calculateFavoriteConversion(transactions: any[]) {
  if (!transactions.length) return ['-', 0]
  
  const conversionCounts = transactions.reduce((acc, t) => {
    const key = `${t.originCurrency.symbol}→${t.destinationCurrency.symbol}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const sortedConversions = Object.entries(conversionCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))

  return sortedConversions[0] || ['-', 0]
}
