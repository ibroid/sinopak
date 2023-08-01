import { dataHandler, pageHandler, saveHandler, testNotifHandler } from "./Handler.js";

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
    {
        url: '/pmh_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/pmh_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
]

export default pmhRoute;