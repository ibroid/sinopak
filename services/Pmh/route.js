import { dataHandler, pageHandler } from "./Handler.js";

/**
 * @type {import("fastify/types/route").RouteOptions[]}
 */
const pmhRoute = [
    {
        url: '/pmh_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/pmh_data',
        method: 'GET',
        handler: dataHandler
    },
]

export default pmhRoute;