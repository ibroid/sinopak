import prisma from "../../db/sinopak.js"

/**
 * @type {import("fastify/types/route").RouteHandler}
 */
export function pageHandler(req, res) {
    res.sendFile('pages/ppp.html')
}

export async function dataHandler() {
    const data = await prisma.jenis_notifikasi.findFirst({
        where: {
            key: 'ppp'
        },
        include: {
            log_notifikasi: true,
            notifikasi: true
        }
    })

    res.status(200).send(res_success({ data: data }))
}

export function saveHandler() {

}

export function testNotifHandler() {

}