import pacRoute from "./services/Pac/route.js";
import phsRoute from "./services/Phs/route.js";
import pjsRoute from "./services/Pjs/route.js";
import pmhRoute from "./services/Pmh/route.js";
import pppRoute from "./services/Ppp/route.js";
import prsRoute from "./services/Prs/route.js";
import ptsRoute from "./services/Pts/route.js";
import purRoute from "./services/Pur/route.js";
import spvRoute from "./services/Spv/route.js";

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
    {
        url: "/api_test",
        method: "GET",
        handler: (req, res) => {
            return {
                status: 'ok'
            }
        }
    },
    ...pmhRoute,
    ...pppRoute,
    ...pjsRoute,
    ...phsRoute,
    ...ptsRoute,
    ...spvRoute,
    ...prsRoute,
    ...pacRoute,
    ...purRoute
];

export default routes;

