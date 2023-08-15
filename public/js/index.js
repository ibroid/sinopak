const { createApp, ref, onMounted, reactive } = Vue;
const { createVuetify } = Vuetify;
const { useRouter, useRoute, START_LOCATION } = VueRouter;

import pmhSetup from "./pmh.js";
import pppSetup from "./ppp.js";
import pjsSetup from "./pjs.js";
import phsSetup from "./phs.js";
import ptsSetup from "./Pts.js";
import spvSetup from "./spv.js";
import prsSetup from "./prs.js";
import pacSetup from "./pac.js";
import purSetup from "./pur.js";

async function bootstrap() {

    const urls = [
        '/main_page', '/beranda_page', '/pmh_page', '/ppp_page', '/pjs_page', '/phs_page', '/pts_page', '/spv_page', '/prs_page', '/pac_page', '/pur_page'
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
                    const loading = reactive({
                        fetch: false,
                        submit: false
                    })
                    async function startWhatsapp() {
                        // const
                    }
                    return {
                        message
                    }
                }
            }
        },
        {
            path: '/pmh', component: { template: pages[2], ...pmhSetup }
        },
        {
            path: '/ppp', component: { template: pages[3], ...pppSetup }
        },
        {
            path: '/pjs', component: { template: pages[4], ...pjsSetup }
        },
        {
            path: '/phs', component: { template: pages[5], ...phsSetup }
        },
        {
            path: '/pts', component: { template: pages[6], ...ptsSetup }
        },
        {
            path: '/spv', component: { template: pages[7], ...spvSetup }
        },
        {
            path: '/prs', component: { template: pages[8], ...prsSetup }
        },
        {
            path: '/pac', component: { template: pages[9], ...pacSetup }
        },
        {
            path: '/pur', component: { template: pages[10], ...purSetup }
        },
    ]

    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes,
    });


    const vuetify = createVuetify()
    const app = createApp({
        template: pages[0],
        setup() {
            const pageLoading = ref(false)
            const router = useRouter();
            const pageError = ref(false)

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
                message, items, router, pageLoading, pageError
            }
        }
    });

    await app.use(router).use(vuetify).mount('#app')

}

bootstrap().catch(err => document.querySelector("#app").innerHTML = "<h1>Failed initialize UI. Error :" + err + "</h1>")