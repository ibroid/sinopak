import prisma from "../db/sinopak.js"
import { waktuSekarang } from "./date_helper.js"

export async function logSave({ id, pesan, number, tujuan }) {
    await prisma.log_notifikasi.create({
        data: {
            number,
            pesan,
            tujuan,
            waktu: waktuSekarang(),
            jenis_notifikasi_id: id,
        }
    })
}