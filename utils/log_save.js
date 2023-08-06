import prisma from "../db/sinopak.js"

export async function logSave({ id, pesan, number, tujuan }) {
    await prisma.log_notifikasi.create({
        data: {
            jenis_notifikasi_id: id,
            number,
            pesan,
            tujuan
        }
    })
}