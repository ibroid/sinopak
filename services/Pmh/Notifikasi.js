import prismaSipp from "../../db/sipp.js"
import prismaSinopak from "../../db/sinopak.js"
import { sendMessage } from "../../utils/send_wa.js"

export async function sendNotif(number, text) {

}

export async function notifText(nomorPerkara = "123/Pdt.G/2023/" + process.env.PERKARA_KODE) {
    try {

        const data = await Promise.all([
            prismaSipp.perkara.findFirstOrThrow({
                where: {
                    nomor_perkara: nomorPerkara
                }
            }),
            prismaSinopak.notifikasi.findFirst({
                where: {
                    jenis_notifikasi_id: 1
                }
            })
        ])

        return data[1].pesan.replace('{nomor_perkara}', data[0].nomor_perkara);

    } catch (error) {
        console.log("error get pesan notif pmh. " + error.message)

        return null;
    }

}

export async function sendNotifTest(number) {
    const pesan = await notifText()
    if (pesan == null) {
        throw new Error('Terjadi kesalahan saat mengambil pesan notif')
    }
    sendMessage(number, pesan)
        .then(r => {
            saveLog(pesan, number)
        })
        .catch(err => console.log(err))
}

export async function saveLog(pesan, number) {
    return prismaSinopak.log_notifikasi.create({
        data: {
            pesan: pesan,
            tujuan: number,
            jenis_notifikasi_id: 1,
        }
    })
}

