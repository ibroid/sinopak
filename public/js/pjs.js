const { reactive, ref, onMounted } = Vue;
import { useWebSocket } from "./Websocket.js";

const pjsSetup = {
    setup() {
        const loading = reactive({
            fetch: true,
            submit: []
        })

        const error = reactive({
            fetch: false,
            submit: []
        })

        const snackbar = reactive({
            open: false,
            message: null
        })

        const data = ref(null)
        const dialog = ref(false)
        const selectedIndex = ref(null)
        const nomorTelpPenerima = ref(null)

        const { isConnected, socket } = useWebSocket('ws://localhost:3000/log_event');

        onMounted(() => {
            if (isConnected) {
                snackbar.open = true;
                snackbar.message = "Berhasil Terhubung ke Websocket"
            }
        })

        socket.onmessage = (event) => {
            const eventData = JSON.parse(event.data)
            data.value.log_notifikasi.push(eventData.payload)
        }

        onMounted(() => {
            fetch('/pjs_data')
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    return res.json()
                })
                .then(res => {
                    // console.log(res.data)
                    data.value = res.data;
                    res.data.notifikasi.forEach((row, i) => {
                        loading.submit[i] = false;
                    });
                    res.data.notifikasi.forEach((row, i) => {
                        error.submit[i] = false;
                    });
                })
                .catch(err => {
                    console.log(err)
                    error.fetch = err
                })
                .finally(() => loading.fetch = false)
        })

        const save = async (index) => {
            loading.submit[index] = true
            try {
                const send = await fetch('/pjs_update', {
                    method: "POST",
                    body: JSON.stringify({
                        id: data.value.notifikasi[index].id,
                        pesan: data.value.notifikasi[index].pesan,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(res.statusText)
                        }
                        return res.json()
                    })

                snackbar.message = send.message
            } catch (error) {
                snackbar.message = error
            }
            loading.submit[index] = false;
            snackbar.open = true;
        }

        const testNotif = () => {
            if (!nomorTelpPenerima.value) {
                return;
            }

            if (selectedIndex.value == null) {
                return;
            }

            fetch('/pjs_test_notif', {
                method: "POST",
                body: JSON.stringify({
                    number: nomorTelpPenerima.value,
                    notifikasi_id: data.value.notifikasi[selectedIndex.value].id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText)
                    }
                    return res.json()
                })
                .then(res => {
                    snackbar.message = res.message
                })
                .catch(err => {
                    snackbar.message = err.message
                })
                .finally(() => {
                    snackbar.open = true
                    dialog.value = false
                })
        }


        return {
            loading,
            error,
            dialog,
            data,
            save,
            snackbar,
            selectedIndex,
            testNotif,
            nomorTelpPenerima
        }
    }
}

export default pjsSetup;