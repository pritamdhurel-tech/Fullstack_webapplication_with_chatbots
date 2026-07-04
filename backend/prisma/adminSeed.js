// prisma/seed.js
// Run with: npm run db:seed
// Creates the initial admin account using credentials from .env

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.admin.findUnique({
    where: { username: process.env.ADMIN_USERNAME },
  })

  if (existing) {
    console.log('Admin account already exists — skipping seed.')
    return
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)

  await prisma.admin.create({
    data: {
      username: process.env.ADMIN_USERNAME,
      email:    process.env.ADMIN_EMAIL,
      password: hashedPassword,
    },
  })

  console.log(`Admin account created: ${process.env.ADMIN_USERNAME}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
