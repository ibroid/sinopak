const { ref, onMounted, reactive } = Vue;

const pmhSetup = {
    setup() {
        const data = ref(null)
        const error = ref(false)
        const loading = ref(true)
        const snackbar = ref(false)
        const submitLoading = ref(false)
        const submitResponse = ref(null)
        const dialog = ref(false)
        const nomorTelpPenerima = ref(null)

        onMounted(function () {
            fetch('/pmh_data')
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
                    error.value = err
                })
                .finally(() => loading.value = false)
        })

        const save = async () => {
            submitLoading.value = true
            try {
                const send = await fetch('/pmh_update', {
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

                submitResponse.value = send.message;
            } catch (error) {
                submitResponse.value = error;
            }
            submitLoading.value = false;
            snackbar.value = true;
        }

        const rules = [
            value => !!value || 'Required.',
            value => (value && value.length >= 3) || 'Min 3 characters',
        ]

        const testNotif = () => {
            if (!nomorTelpPenerima.value) {
                return;
            }

            fetch('/pmh_test_notif', {
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
                    submitResponse.value = res.message
                })
                .catch(err => {
                    submitResponse.value = err.message
                })
                .finally(() => {
                    snackbar.value = true
                })
        }

        return {
            data,
            error,
            loading,
            submitLoading,
            snackbar,
            save,
            submitResponse,
            testNotif,
            dialog,
            nomorTelpPenerima,
            rules
        }
    }
}

export default pmhSetup;