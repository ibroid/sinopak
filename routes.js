import pmhRoute from "./services/Pmh/route.js";
import pppRoute from "./services/Ppp/route.js";
/**
 * @type {import("fastify/types/route").RouteOptions[]}
 */
const routes = [
    {
        url: "/",
        method: "GET",
        handler: (req, res) => {
            res.sendFile('index.html')
        }
    },
    {
        url: "/main_page",
        method: "GET",
        handler: (req, res) => {
            res.sendFile('pages/main.html')
        }
    },
    {
        url: "/beranda_page",
        method: "GET",
        handler: (req, res) => {
            res.sendFile('pages/beranda.html')
        }
    },
    ...pmhRoute,
    ...pppRoute
];

export default routes;

