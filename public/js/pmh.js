const { ref, onMounted, reactive } = Vue;

const pmhSetup = {
    setup() {
        const data = ref(null)
        const error = ref(false)
        const loading = ref(true)
        const snackbar = ref(false)
        const submitLoading = ref(false)
        const submitResponse = ref(null)
        onMounted(function () {
            fetch('/pmh_data')
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    return res.json()
                })
                .then(res => {
                    console.log(res.data)
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
                }).then(res => {
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

        const testNotif = async () => {

        }

        return {
            data,
            error,
            loading,
            submitLoading,
            snackbar,
            save,
            submitResponse,
            testNotif
        }
    }
}

export default pmhSetup;