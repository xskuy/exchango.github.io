import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener el inicio del día actual y de ayer
    const now = new Date()
    const startOfToday = new Date(now.setHours(0, 0, 0, 0))
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    
    // Obtener estadísticas
    const [
      totalUsers,
      totalTransactions,
      todayTransactions,
      yesterdayTransactions,
      volumeStats,
      currencyStats
    ] = await Promise.all([
      // Total de usuarios
      prisma.user.count(),
      
      // Total de transacciones
      prisma.transaction.count(),
      
      // Transacciones de hoy
      prisma.transaction.count({
        where: {
          date: {
            gte: startOfToday
          }
        }
      }),
      
      // Transacciones de ayer
      prisma.transaction.count({
        where: {
          date: {
            gte: startOfYesterday,
            lt: startOfToday
          }
        }
      }),
      
      // Volumen de transacciones por mes
      prisma.transaction.groupBy({
        by: ['date'],
        _sum: {
          amount: true
        },
        orderBy: {
          date: 'asc'
        },
        take: 7
      }),
      
      // Estadísticas por moneda
      prisma.transaction.groupBy({
        by: ['destinationCurrencyId'],
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      })
    ])

    // Calcular porcentajes de cambio
    const transactionChange = yesterdayTransactions > 0
      ? ((todayTransactions - yesterdayTransactions) / yesterdayTransactions) * 100
      : 0

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTransactions,
        activeTransactions: todayTransactions,
        transactionChange,
        volumeStats,
        currencyStats
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Error fetching dashboard statistics' },
      { status: 500 }
    )
  }
}
