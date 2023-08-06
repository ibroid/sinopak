import moment from 'moment';
import 'moment/locale/id.js';

export function dateIndo(date) {
    const tanggal = moment(date);
    moment.locale('id');
    return tanggal.format("dddd, DD MMMM YYYY");
}

export function waktuSekarang() {
    const tanggal = moment(Date.now());
    moment.locale('id');
    return tanggal.format("LLLL");
}