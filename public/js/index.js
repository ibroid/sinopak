const { createApp, ref, onMounted } = Vue
const { createVuetify } = Vuetify
import pmhSetup from "./pmh.js";

async function bootstrap() {

    const urls = [
        '/main_page', '/beranda_page', '/pmh_page'
    ];

    const fetchPages = Promise.all(
        urls.map(url => fetch(url).then(res => res.text()))
    )

    const pages = await fetchPages;


    const routes = [
        {
            path: '/', component: {
                template: pages[1],
                setup() {
                    const message = ref('kuya batok');

                    return {
                        message
                    }
                }
            }
        },
        // { path: '/about', component: About },
    ]

    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes,
    });


    const vuetify = createVuetify()
    const app = createApp({
        template: pages[0],
        setup() {
            const message = ref('Hello World')
            const items = [
                {
                    id: 1,
                    color: '',
                    icon: 'mdi-information',
                    text: 'File : add_majelis_hakim_m.php'
                },
                {
                    id: 2,
                    color: 'error',
                    icon: 'mdi-alert-circle',
                    text: 'File : add_panitera_pengganti_m.php'
                },
            ]

            return {
                message, items
            }
        }
    });

    app.use(router).use(vuetify).mount('#app')
}

bootstrap()