export function res_success(payload = {
    message: "Fethcing berhasil",
    status: "Success",
    data: null
}) {
    return payload;
}


export function res_failed(payload = {
    message: "Terjadi Kesalahan",
    status: "Failed",
    data: null
}) {
    return payload;
}