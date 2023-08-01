import { PrismaClient } from '../prisma/generated/sipp_client/index.js'

const globalForPrisma = globalThis;

/**
 * @type {import("../prisma/generated/sipp_client/index.js").PrismaClient;}
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma