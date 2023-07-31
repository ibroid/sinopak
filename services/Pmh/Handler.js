import { PrismaClient } from "../../prisma/generated/sinopak_client/index.js";
import { res_failed, res_success } from "../../utils/response_json.js";

/**
 * @type {import("fastify/types/route").RouteHandler}
 */
export function pageHandler(req, res) {
    res.sendFile('pages/pmh.html')
}

/**
 * @type {import("fastify/types/route").RouteHandler}
 */
export async function dataHandler(req, res) {
    const prisma = new PrismaClient()
    try {
        const data = await prisma.jenis_notifikasi.findFirst({
            where: {
                key: 'pmh'
            },
            include: {
                log_notifikasi: true,
                notifikasi: true
            }
        })

        res.status(200).send(res_success({ data: data }))
    } catch (error) {

        res.status(400).send(res_failed({ message: "Terjadi kesalahan. " + error.message }))
    }
}