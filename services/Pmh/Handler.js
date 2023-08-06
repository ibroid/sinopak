import { res_failed, res_success } from "../../utils/response_json.js";
import { sendNotifTest } from "./Notifikasi.js";
import prisma from "../../db/sinopak.js"

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
    // console.log(process.env.MODE)
    const data = await prisma.jenis_notifikasi.findFirst({
        where: {
            key: 'pmh'
        },
        include: {
            log_notifikasi: true,
            notifikasi: {
                include: {
                    tujuan: true
                }
            }
        }
    })

    res.status(200).send(res_success({ data: data }))

}

/**
 * @type {import("fastify/types/route").RouteHandler}
 */
export async function saveHandler(req, res) {
    try {
        const data = await prisma.notifikasi.update({
            where: {
                id: parseInt(req.body.id)
            },
            data: {
                pesan: req.body.pesan,
                tujuan: 0,
            }
        })
        res.status(201).send(res_success({ message: "Berhasil menyimpan data", data: data }))
    } catch (error) {

        res.status(400).send(res_failed({ message: "Terjadi kesalahan. " + error.message }))
    }
}

/**
 * @type {import("fastify/types/route").RouteHandler}
 */
export async function testNotifHandler(req, res) {
    try {
        await sendNotifTest(req.body.number);

        res.status(200).send(res_success({ message: `Pesan test berhasil dikirim ke nomor ${req.body.number}` }))
    } catch (error) {
        res.status(400).send(res_failed({ message: `Pesan test gagal dikirim. ${error.message}` }))
    }
}