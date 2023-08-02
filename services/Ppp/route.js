import { dataHandler, pageHandler, saveHandler, testNotifHandler } from "./Handler.js";

/**
 * @type {import("fastify/types/route").RouteOptions[]}
 */
const pppRoute = [
    {
        url: '/ppp_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/ppp_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/ppp_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/ppp_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
]

export default pppRoute;