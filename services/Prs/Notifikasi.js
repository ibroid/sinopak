import prismaSipp from "../../db/sipp.js"
import prismaSinopak from "../../db/sinopak.js"
import { sendMessage } from "../../utils/send_wa.js"
import { dateIndo } from "../../utils/date_helper.js";
import { logSave } from "../../utils/log_save.js";

export async function sendNotifTest(request) {
    const pesan = await notifText(request.notifikasi_id);
    if (pesan == null) {
        throw new Error('Terjadi kesalahan saat mengambil pesan notif')
    }
    // return false;
    await sendMessage(request.number, pesan.text)
    await logSave({
        id: pesan.jenis_notifikasi_id,
        pesan: pesan.text,
        number: request.number,
        tujuan: pesan.tujuan
    })
}

export async function notifText(notifikasi_id) {

    const today = new Date().toISOString().slice(0, 10);

    const data = await Promise.all([
        prismaSipp.$queryRaw`SELECT nomor_perkara,a.* FROM perkara_jadwal_sidang AS a
        LEFT JOIN perkara_pelaksanaan_relaas AS b ON a.id = b.sidang_id
        LEFT JOIN perkara AS c ON a.perkara_id = c.perkara_id
        WHERE a.tanggal_sidang = CURDATE()
        AND b.id IS NULL
        AND a.urutan <= 2`,

        prismaSinopak.notifikasi.findFirst({
            where: {
                id: notifikasi_id
            },
            include: {
                tujuan: true
            }
        })
    ])

    // console.log(data[0]);
    // console.log(new Date(today));
    let daftar = ''

    data[0].forEach(row => {
        daftar += row.nomor_perkara + '\n';
    });

    const pesan = data[1].pesan
        .replace('{daftar_relaas}', daftar)


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