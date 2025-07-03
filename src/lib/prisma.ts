/* eslint-disable @typescript-eslint/no-var-requires */
import type { PrismaClient } from '@prisma/client';
const { PrismaClient: PrismaClientConstructor } = require('@prisma/client');

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClientConstructor({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;