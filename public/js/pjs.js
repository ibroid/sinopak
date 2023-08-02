const { ref, onMounted, reactive } = Vue;

const pjsSetup = {
    setup() {
        const loading = reactive({
            submit: false,
            fetch: true
        })

        const error = reactive({
            submit: false,
            fetch: false
        })

        const snackbar = reactive({
            open: false,
            message: null
        })

        const data = ref(null)
        const dialog = ref(false)
        const nomorTelpPenerima = ref(null);

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
                })
                .catch(err => {
                    console.log(err)
                    error.fetch = err
                })
                .finally(() => loading.fetch = false)
        })

        const rules = [
            value => !!value || 'Required.',
            value => (value && value.length >= 3) || 'Min 3 characters',
        ]

        const save = async () => {
            loading.submit = true
            try {
                const send = await fetch('/pjs_update', {
                    method: "POST",
                    body: JSON.stringify({
                        id: data.value.notifikasi[0].id,
                        pesan: data.value.notifikasi[0].pesan,
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
            loading.submit = false;
            snackbar.open = true;
        }

        const testNotif = () => {
            if (!nomorTelpPenerima.value) {
                return;
            }

            fetch('/pjs_test_notif', {
                method: "POST",
                body: JSON.stringify({
                    number: nomorTelpPenerima.value,
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
            nomorTelpPenerima,
            testNotif,
            snackbar,
            loading,
            dialog,
            error,
            data,
            save,
            rules
        }
    }
}

export default pjsSetup;