import prismaSipp from "../../db/sipp.js"
import prismaSinopak from "../../db/sinopak.js"
import { sendMessage } from "../../utils/send_wa.js"
import { dateIndo } from "../../utils/date_helper.js";
import { logSave } from "../../utils/log_save.js";
import { rupiah } from "../../utils/konkurensi.js";
import angkaTerbilangJs from "@develoka/angka-terbilang-js";
import moment from "moment";

export async function sendNotifTest(request) {
    const pesan = await notifText(request.notifikasi_id);
    if (pesan == null) {
        throw new Error('Terjadi kesalahan saat mengambil pesan notif')
    }

    await sendMessage(request.number, pesan.text)
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
                para_pihak: true,
                perkara_putusan: {
                    select: {
                        amar_putusan: true,
                        tanggal_putusan: true,
                        putusan_verstek: true
                    }
                },
                perkara_biaya: true,
                perkara_pihak1: {
                    select: {
                        nama: true,
                        alamat: true
                    }
                },
                perkara_pihak2: {
                    select: {
                        nama: true,
                        alamat: true
                    }
                },
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

    let saldoMasuk = 0;
    let saldoKeluar = 0;

    const putusDate = moment(data[0].perkara_putusan.tanggal_putusan, 'YYYY-MM-DD');
    if (putusDate.isSame(Date.now(), 'day')) {
        saldoKeluar += 20000;
    }

    data[0].perkara_biaya.forEach(row => {
        if (row.jenis_transaksi == 1) {
            saldoMasuk += parseFloat(String(row.jumlah).replace('.00', ''));
        } else {
            saldoKeluar += parseFloat(String(row.jumlah).replace('.00', ''));
        }

    });

    const pesan = data[1].pesan
        .replace('{nomor_perkara}', data[0].nomor_perkara)
        .replace('{tanggal_putus}', dateIndo(data[0].perkara_putusan.tanggal_putusan))
        .replace('{nama_pihak}', data[0].perkara_pihak2[0].nama)
        .replace('{alamat_pihak}', data[0].perkara_pihak2[0].alamat)
        .replace('{sisa_panjar}', rupiah(String(saldoMasuk - saldoKeluar)))
        .replace('{terbilang_sisa_panjar}', angkaTerbilangJs(saldoMasuk - saldoKeluar));

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