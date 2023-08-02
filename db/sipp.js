import { PrismaClient } from '../prisma/generated/sipp_client/index.js'

let prisma

if (typeof globalThis.prisma !== PrismaClient) {
    globalThis.prisma = new PrismaClient()
}

prisma = globalThis.prisma

export default prisma