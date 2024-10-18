import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = [
    { name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
    { name: 'Regular User', email: 'user@example.com', role: 'USER' },
    // Agrega más usuarios según sea necesario
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  console.log('Usuarios creados o actualizados')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

