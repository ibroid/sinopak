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

export async function startSpvJurusita(perkara_id) {

    const today = new Date().toISOString().slice(0, 10);
    const data = await Promise.all([
        prismaSipp.perkara.findFirst({
            select: {
                nomor_perkara: true,
                jenis_perkara_nama: true,
                perkara_putusan: {
                    select: {
                        putusan_verstek: true,
                        tanggal_putusan: true
                    }
                },
                perkara_jadwal_sidang: {
                    where: {
                        tanggal_sidang: {
                            equals: new Date(today)
                        }
                    }
                },
                perkara_jurusita: {
                    select: {
                        jurusita: {
                            select: {
                                nama_gelar: true,
                                keterangan: true
                            }
                        }
                    }
                }
            },
            where: {
                perkara_id: perkara_id
            }
        }),
        prismaSinopak.notifikasi.findFirstOrThrow({
            where: {
                id: 8
            },
            include: {
                tujuan: true
            }
        })
    ])

    if (data[0].jenis_perkara_nama !== 'Cerai Gugat' && data[0].jenis_perkara_nama !== 'Cerai Talak') {
        throw new Error(`Validasi gagal. ${data[0].nomor_perkara} bukan perkara Gugat/Talak`)
    }

    if (data[0].perkara_putusan == null) {
        throw new Error(`Validasi gagal. ${data[0].nomor_perkara} bukan perkara putus`)
    }

    if (data[0].perkara_putusan?.putusan_verstek == 'T') {
        throw new Error(`Validasi gagal. ${data[0].nomor_perkara} Bukan perkara putus verstek`)
    }

    if (
        data[0].perkara_jadwal_sidang[0].sidang_keliling == 'Y' ||
        data[0].perkara_jadwal_sidang[0].dihadiri_oleh == null ||
        data[0].perkara_jadwal_sidang[0].sampai_jam == null
    ) {
        throw new Error(`Validasi gagal. ${data[0].nomor_perkara} Notif tidak berjalan untuk perkara sidang keliling, atau data kehadiran belum di isi`)
    }

    const pesan = data[1].pesan
        .replace('{nomor_perkara}', data[0].nomor_perkara)
        .replace('{tanggal_putus}', dateIndo(data[0].perkara_putusan.tanggal_putusan));

    data[0].perkara_jurusita.forEach(async (v, i, a) => {

        if (data[0].perkara_jadwal_sidang[0].dihadiri_oleh == 4) {
            execSend(v.jurusita, pesan, data[1].jenis_notifikasi_id, data[1].tujuan.nama + ' ke ' + String(i + 1))
            return;
        }

        if (
            data[0].perkara_jadwal_sidang[0].dihadiri_oleh == 2
            && a.length > 1
            && i == 1
        ) {
            execSend(v.jurusita, pesan, data[1].jenis_notifikasi_id, data[1].tujuan.nama + ' ke 2')
            return;
        }

        if (
            data[0].perkara_jadwal_sidang[0].dihadiri_oleh == 3
            && a.length > 1
            && i == 0
        ) {
            execSend(v.jurusita, pesan, data[1].jenis_notifikasi_id, data[1].tujuan.nama + ' ke 1')
            return;
        }

        if (a.length == 1) {
            execSend(v.jurusita, pesan, data[1].jenis_notifikasi_id, data[1].tujuan.nama)
            return;
        }
    })

}

export async function startSpvPihak(perkara_id) {
    const data = Promise.all([
        prismaSipp.perkara.findFirstOrThrow({
            select: {
                nomor_perkara: true,
                perkara_biaya: true,
            },
            where: {
                perkara_id: perkara_id
            }
        }),
        prismaSinopak.notifikasi.findFirst({
            where: {
                id: 9
            },
            include: {
                tujuan: true
            }
        })
    ])

}

export async function execSend(jurusita, pesan, id, tujuan) {
    await sendMessage(jurusita.keterangan, pesan);
    await logSave({
        id: id,
        pesan: pesan,
        number: jurusita.keterangan,
        tujuan: tujuan
    });
}

export async function startNotifSpv(params) {
    await startSpvJurusita(params.perkara_id)
}