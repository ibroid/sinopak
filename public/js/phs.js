const { reactive, ref, onMounted } = Vue;

const phsSetup = {
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

        onMounted(() => {
            fetch('/phs_data')
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
                const send = await fetch('/phs_update', {
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

            fetch('/phs_test_notif', {
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

export default phsSetup;