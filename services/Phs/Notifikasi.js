import prismaSipp from "../../db/sipp.js"
import prismaSinopak from "../../db/sinopak.js"
import { sendMessage } from "../../utils/send_wa.js"
import { dateIndo } from "../../utils/date_helper.js";
import { logSave } from "../../utils/log_save.js";

export async function sendNotifTest(request) {
    const pesan = await notifText(request.notifikasi_id);
    if (pesan.text == null) {
        throw new Error('Terjadi kesalahan saat mengambil pesan notif')
    }
    await sendMessage(request.number, pesan.text)
    await logSave({
        id: request.notifikasi_id,
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
                para_pihak: true,
                perkara_jadwal_sidang: {
                    select: {
                        agenda: true,
                        tanggal_sidang: true,
                        urutan: true
                    },
                    where: {
                        urutan: 1
                    }
                },
                perkara_pihak1: true,
                perkara_pihak2: true,
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

    let dataPihakSatu = '';
    let dataPihakDua = '';

    data[0].perkara_pihak1.forEach(pihak => {
        dataPihakSatu += `Nama : ${pihak.nama}\nAlamat : ${pihak.alamat}`
    })

    data[0].perkara_pihak2.forEach(pihak => {
        dataPihakDua += `Nama : ${pihak.nama}\nAlamat : ${pihak.alamat}`
    })

    const pesan = data[1].pesan
        .replace('{nomor_perkara}', data[0].nomor_perkara)
        .replace('{tanggal_sidang}', dateIndo(data[0].perkara_jadwal_sidang[0].tanggal_sidang))
        .replace('{agenda_sidang}', data[0].perkara_jadwal_sidang[0].agenda)
        .replace('{para_pihak}',
            data[0].para_pihak
                .replace('<br />', '\n')
                .replace('<br />', '\n')
                .replace('<br />', '\n')
                .replace('<br />', '\n')
        )
        .replace('{data_pihak_satu}', dataPihakSatu)
        .replace('{data_pihak_dua}', dataPihakDua)

    return { text: pesan, tujuan: data[1].tujuan.nama };


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