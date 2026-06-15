const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean up existing data
  await prisma.transaction.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // 1. Create Admin User
  const adminPasswordHash = await hash('Admin@123', 10)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@saaskit.com',
      passwordHash: adminPasswordHash,
      isActive: true,
      bio: 'System Administrator',
      notificationSettings: {
        create: {
          emailNotifications: true,
        }
      }
    }
  })
  console.log('Admin user created:', adminUser.email)

  // 2. Create 50 random users
  console.log('Creating 50 random users...')
  const plans = ['FREE', 'PRO', 'ENTERPRISE']
  const statuses = [true, true, true, false] // 75% active

  const users = []
  for (let i = 1; i <= 50; i++) {
    const plan = plans[Math.floor(Math.random() * plans.length)]
    const isActive = statuses[Math.floor(Math.random() * statuses.length)]
    
    // Create random date within last year
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 365))

    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        isActive,
        createdAt: pastDate,
        memberships: {
          create: {
            role: 'MEMBER',
            organization: {
              create: {
                name: `Org ${i}`,
                slug: `org-${i}`,
                plan: plan
              }
            }
          }
        }
      },
      include: {
        memberships: { include: { organization: true } }
      }
    })
    users.push(user)
  }

  // 3. Create 100 random transactions
  console.log('Creating 100 transactions...')
  const txStatuses = ['paid', 'paid', 'paid', 'pending', 'failed'] // Mostly paid

  for (let i = 1; i <= 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const status = txStatuses[Math.floor(Math.random() * txStatuses.length)]
    const org = randomUser.memberships[0]?.organization
    const plan = org?.plan || 'FREE'
    
    let amount = 0
    if (plan === 'PRO') amount = 999
    if (plan === 'ENTERPRISE') amount = 4999

    if (amount > 0 || status !== 'paid') {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 180)) // last 6 months

      await prisma.transaction.create({
        data: {
          userId: randomUser.id,
          userName: randomUser.name,
          userEmail: randomUser.email,
          plan: plan,
          amount: amount,
          status: status,
          invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: pastDate,
        }
      })
    }
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
