const { ref, onMounted, reactive } = Vue;

const pppSetup = {
    setup() {
        console.log('ok')
        const loading = reactive({
            submit: false,
            fetch: false
        })

        const error = reactive({
            submit: false,
            fetch: false
        })

        const data = ref(null)

        onMounted(() => {
            loading.fetch = true
            fetch('/ppp_data')
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
        return {
            loading,
            error,
            data
        }
    }
}

export default pppSetup;