import { prisma as prismaSipp } from "../../db/sipp.js"
import { prisma as prismaSinopak } from "../../db/sinopak.js"
import { sendMessage } from "../../utils/send_wa.js"

export async function sendNotif(number, text) {
    return await fetch(process.env.HTTP_WA_API + '/api/send_text', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "chatId": number,
            "text": text,
            "session": "default"
        })
    }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return res.json()
    })
}

export async function notifText(nomorPerkara = "123/Pdt.G/2023/" + process.env.PERKARA_KODE) {
    try {

        const data = await prismaSipp.perkara.findFirstOrThrow({
            where: {
                nomor_perkara: nomorPerkara
            }
        })

        const notifikasi = await prismaSinopak.notifikasi.findFirst({
            where: {
                jenis_notifikasi_id: 1
            }
        })

        return notifikasi.pesan.replace('{nomor_perkara}', data.nomor_perkara);

    } catch (error) {
        console.log("error get pesan notif pmh. " + error.message)

        return null;
    }

}

export async function sendNotifTest(number) {
    const pesan = await notifText()
    sendMessage(number, pesan);
}

