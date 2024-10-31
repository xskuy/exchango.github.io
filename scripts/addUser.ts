import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    const email = 'benja@ejemplo.com'
    const name = 'Benjamin'
    const password = 'contraseña1'
    const role = 'USER'

    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('Attempting to create user...')
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    })

    console.log(`Usuario creado: ${user.name} (${user.email})`)
  } catch (error) {
    console.error('Error al crear el usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
