const { ref, onMounted, reactive } = Vue;

const pmhSetup = {
    setup() {
        const data = ref(null)
        const error = ref(false)
        const loading = ref(true)
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

        return {
            data,
            error,
            loading
        }
    }
}

export default pmhSetup;