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
        url: "/kuya",
        method: "GET",
        handler: (req, res) => {
            return {
                status: "batok"
            }
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
        url: "/pmh_page",
        method: "GET",
        handler: (req, res) => {
            res.sendFile('pages/pmh.html')
        }
    },
];

export default routes;

