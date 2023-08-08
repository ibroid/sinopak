import prismaSipp from "../../db/sipp.js"
import prismaSinopak from "../../db/sinopak.js"
import { sendMessage } from "../../utils/send_wa.js"
import { dateIndo } from "../../utils/date_helper.js";
import { logSave } from "../../utils/log_save.js"

export async function sendNotifTest(request) {
    const pesan = await notifText(request.notifikasi_id);
    if (pesan == null) {
        throw new Error('Terjadi kesalahan saat mengambil pesan notif')
    }
    await sendMessage(request.number, pesan.text)
    // saveLog(pesan, request.number, request.notifikasi_id)
    await logSave({
        id: pesan.jenis_notifikasi_id,
        pesan: pesan.text,
        number: request.number,
        tujuan: pesan.tujuan
    })
}

export async function notifText(notifikasi_id) {

    const data = await Promise.all([
        prismaSipp.perkara.findFirstOrThrow({
            select: {
                nomor_perkara: true,
                perkara_akta_cerai: true
            },
            where: {
                nomor_perkara: "123/Pdt.G/2023/" + process.env.PERKARA_KODE,
            }
        }),
        prismaSinopak.notifikasi.findFirst({
            where: {
                id: notifikasi_id
            },
            include: {
                tujuan: true
            }
        })
    ])


    const pesan = data[1].pesan
        .replace('{nomor_perkara}', data[0].nomor_perkara)
        .replace('{nomor_ac}', data[0].perkara_akta_cerai.nomor_akta_cerai)
        .replace('{tanggal_terbit}', dateIndo(data[0].perkara_akta_cerai.tgl_akta_cerai))

    // return pesan;
    return { text: pesan, tujuan: data[1].tujuan.nama, jenis_notifikasi_id: data[1].jenis_notifikasi_id };
}

export async function saveLog(pesan, number, id) {
    return prismaSinopak.log_notifikasi.create({
        data: {
            pesan: pesan,
            tujuan: number,
            jenis_notifikasi_id: id,
        }
    })
}