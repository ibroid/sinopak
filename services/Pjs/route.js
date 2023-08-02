import { dataHandler, pageHandler, saveHandler, testNotifHandler } from "./Handler.js";

/**
 * @type {import("fastify/types/route").RouteOptions[]}
 */
const pjsRoute = [
    {
        url: '/pjs_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/pjs_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/pjs_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/pjs_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
];

export default pjsRoute;