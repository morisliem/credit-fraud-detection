import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()


async function main() {
    console.log('Seed start ...\n')

    const hash = async (pw: string) => await bcrypt.hash(pw, 10)

    const demoUsers = [
        {
            email: 'demo-1@example.com',
            username: 'demo-1',
            password: await hash('demo-1'),
        },
        {
            email: 'demo-2@example.com',
            username: 'demo-2',
            password: await hash('demo-2'),
        },
        {
            email: 'demo-3@example.com',
            username: 'demo-3',
            password: await hash('demo-3'),
        },
    ]

    for (const user of demoUsers) {
        const created = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user
        })
        console.log(`Created user: ${created.email}`)
    }
}

main().then(() => {
    console.log('Seed complete')
    return prisma.$disconnect()
}).catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
})