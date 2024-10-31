import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  try {
    const email = 'benja@ejemplo.com'
    const name = 'Benjamin'
    const password = 'contraseña1'
    const role = 'USER'
    const walletId = uuidv4()

    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('Creating user and wallet...')
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        walletId,
        status: 'ACTIVE',
        wallet: {
          create: {
            balance: 0.0
          }
        }
      },
      include: {
        wallet: true
      }
    })

    console.log('Usuario creado exitosamente:')
    console.log(`ID: ${user.id}`)
    console.log(`Nombre: ${user.name}`)
    console.log(`Email: ${user.email}`)
    console.log(`Wallet ID: ${user.walletId}`)
    console.log(`Balance inicial: ${user.wallet?.balance}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al crear el usuario:', error.message)
    } else {
      console.error('Error desconocido:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
