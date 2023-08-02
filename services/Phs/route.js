import { dataHandler, pageHandler, saveHandler, testNotifHandler } from "./Handler.js";

const phsRoute = [
    {
        url: '/phs_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/phs_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/phs_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/phs_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
]

export default phsRoute;