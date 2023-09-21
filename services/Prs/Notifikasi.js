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

export async function notifTextHakim(hakim_id) {

    const data = await Promise.all([
        prismaSipp.$queryRaw`SELECT nomor_perkara,a.* FROM perkara_jadwal_sidang AS a
        LEFT JOIN perkara_pelaksanaan_relaas AS b ON a.id = b.sidang_id
        LEFT JOIN perkara AS c ON a.perkara_id = c.perkara_id
        LEFT JOIN perkara_hakim_pn AS d ON d.perkara_id = a.perkara_id
        WHERE a.tanggal_sidang = CURDATE()
        AND b.id IS NULL
        AND a.urutan <= 2
        AND (a.agenda LIKE 'sidang pertama' OR a.agenda LIKE 'panggil%')
        and d.hakim_id = ${hakim_id}
        and d.aktif = 'Y'
        and d.urutan = 1`
        ,
        prismaSinopak.notifikasi.findFirst({
            where: {
                id: 11
            },
            include: {
                tujuan: true
            }
        })

    ])

    let daftar = ''

    data[0].forEach(row => {
        daftar += row.nomor_perkara + '\n';
    });

    const pesan = data[1].pesan
        .replace('{daftar_relaas}', daftar);


    if (data[0].length == 0) {
        return null;
    }


    return { text: pesan, tujuan: data[1].tujuan.nama, jenis_notifikasi_id: data[1].jenis_notifikasi_id };
}

export async function notifTextJurusita(js_id) {

    const data = await Promise.all([
        prismaSipp.$queryRaw`SELECT nomor_perkara FROM perkara_jadwal_sidang AS a
        LEFT JOIN perkara_pelaksanaan_relaas AS b ON a.id = b.sidang_id
        LEFT JOIN perkara AS c ON a.perkara_id = c.perkara_id
        LEFT JOIN perkara_jurusita AS d ON d.perkara_id = a.perkara_id
        WHERE a.tanggal_sidang = CURDATE()
        AND b.id IS NULL
        AND a.urutan <= 2
        AND (a.agenda LIKE 'sidang pertama' OR a.agenda LIKE 'panggil%')
        and d.jurusita_id = ${js_id}`
        ,
        prismaSinopak.notifikasi.findFirst({
            where: {
                id: 14
            },
            include: {
                tujuan: true
            }
        })
    ]);

    let daftar = ''

    data[0].forEach(row => {
        daftar += row.nomor_perkara + '\n';
    });

    const pesan = data[1].pesan
        .replace('{daftar_relaas}', daftar);


    if (data[0].length == 0) {
        return null;
    }


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

export async function startNotifPrs() {
    await startPrsHakim();
    await startPrsJurusita();
    await startPrsPanitera();
}

export async function startPrsHakim() {
    const paraHakim = await prismaSipp.hakim_pn.findMany({
        where: {
            aktif: 'Y'
        }
    })

    await Promise.all(
        paraHakim.map(async (hakim) => {
            const message = await notifTextHakim(hakim.id)

            if (
                hakim.keterangan == null
                || hakim.keterangan == ''
                || message == null
            ) {
                return false;
            }

            sendMessage(hakim.keterangan, message.text)

            logSave({
                id: 7,
                number: hakim.keterangan,
                tujuan: message.tujuan,
                pesan: message.text
            })
        })
    )
}

export async function startPrsJurusita() {
    const jsp = await prismaSipp.jurusita.findMany({
        where: {
            aktif: 'Y'
        }
    })

    await Promise.all(
        jsp.map(async (js) => {
            const message = await notifTextJurusita(js.id);

            if (
                js.keterangan == null
                || js.keterangan == ''
                || message == null
            ) {
                return false
            }

            sendMessage(js.keterangan, message.text)

            logSave({
                id: 7,
                number: js.keterangan,
                tujuan: message.tujuan,
                pesan: message.text
            })

        })
    )
}

export async function startPrsPanitera(params) {
    const data = await prismaSipp.$queryRaw`SELECT nomor_perkara,agenda FROM perkara_jadwal_sidang AS a
    LEFT JOIN perkara_pelaksanaan_relaas AS b ON a.id = b.sidang_id
    LEFT JOIN perkara AS c ON a.perkara_id = c.perkara_id
    WHERE a.tanggal_sidang = CURDATE()
    AND b.id IS NULL
    AND a.urutan <= 2
    AND (a.agenda LIKE 'sidang pertama' OR a.agenda LIKE 'panggil%')`;

    const messageTemplate = "*NOTIFIKASI PEMBERITAHUAN RELAAS*\nBerikut daftar relaas yangg belum terupload untuk sidang hari ini\n\n{daftar_relaas}"

    let daftar = ''

    data.forEach(row => {
        daftar += row.nomor_perkara + '\n';
    });

    const message = messageTemplate.replace("{daftar_relaas}", daftar)

    const dataPanitera = await prismaSinopak.pengaturan.findFirst({
        where: {
            key: "nomor_panitera"
        }
    })

    sendMessage(dataPanitera.value, message);

}