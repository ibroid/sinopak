import { PrismaClient } from '../prisma/generated/sinopak_client/index.js';

/**
 * @type {import("../prisma/generated/sinopak_client/index.js").PrismaClient}
 */
let prisma

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (typeof globalThis.prisma !== PrismaClient) {
        globalThis.prisma = new PrismaClient()
    }
    prisma = globalThis.prisma
}


export default prisma