import prisma from "../db/sinopak.js"
import { waktuSekarang } from "./date_helper.js"
import { getShock } from "../webshock.js"

export async function logSave({ id, pesan, number, tujuan }) {
    const data = await prisma.log_notifikasi.create({
        data: {
            number,
            pesan,
            tujuan,
            waktu: waktuSekarang(),
            jenis_notifikasi_id: id,
        }
    })
    logEvent(data)
    return data;
}

export async function logEvent(data) {
    try {
        const websocket = getShock('web');
        websocket?.send(JSON.stringify({
            event: "log",
            payload: data
        }))
    } catch (error) {
        console.log('cannot send sock log')
    }
}