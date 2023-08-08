import prismaSipp from "../../db/sipp.js"
import prismaSinopak from "../../db/sinopak.js"
import { sendMessage } from "../../utils/send_wa.js"
import { dateIndo } from "../../utils/date_helper.js";
import { logSave } from "../../utils/log_save.js";
import { statusKetemu } from "../../utils/sipp_helper.js";

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
	});
}

export async function notifText(notifikasi_id) {

	const today = new Date().toISOString().slice(0, 10);

	const data = await Promise.all([
		prismaSipp.perkara_pelaksanaan_relaas.findFirst({
			select: {
				tanggal_relaas: true,
				ket_temu: true,
				ket_hasil_relaas: true,
				jadwal_sidang: {
					select: {
						perkara: {
							select: {
								nomor_perkara: true
							}
						}
					}
				}
			},
			where: {
				id: 38370
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

	// console.log(data[0]);

	const pesan = data[1].pesan
		.replace('{nomor_perkara}', data[0].jadwal_sidang.perkara.nomor_perkara)
		.replace('{tanggal_pelaksanaan}', dateIndo(data[0].tanggal_relaas))
		.replace('{status_panggilan}', statusKetemu(data[0].ket_temu))
		.replace('{detail}', data[0].ket_hasil_relaas)


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