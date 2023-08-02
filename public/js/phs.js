const { reactive } = Vue;

const phsSetup = {
    setup() {
        const loading = reactive({
            fetch: true,
            submit: false
        })

        const error = reactive({
            fetch: false,
            submit: false
        })

        const data = ref(null)
        const dialog = ref(false)

        onMounted(() => {
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
            error
        }
    }
}

export default phsSetup;