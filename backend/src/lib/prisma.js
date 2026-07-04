// src/lib/prisma.js
// Single Prisma client instance shared across the whole app.
// Prevents "too many connections" errors in development with hot reload.

const { PrismaClient } = require('@prisma/client')

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

module.exports = prisma
