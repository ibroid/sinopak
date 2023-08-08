export function statusPihak(id) {
    if (id == 1) {
        return "Semua Pihak";
    }
    if (id == 2) {
        return "Penggugat Saja";
    }
    if (id == 3) {
        return "Tergugat Saja";
    }
    if (id == 10) {
        return "Sebagian Penggugat";
    }
    if (id == 10) {
        return "Sebagian Tergugat";
    }
}

export function statusKetemu(data) {
    if (data == 'Y') {
        return 'Bertemu';
    }

    if (data == 'T') {
        return 'Tidak Bertemu';
    }

    if (data == 'S') {
        return 'POS INDONESIA';
    }

    if (data == 'E') {
        return 'ECOURT';
    }

}