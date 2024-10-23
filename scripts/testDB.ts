import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const usersCount = await prisma.user.count()
    console.log(`Número de usuarios en la base de datos: ${usersCount}`)
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

