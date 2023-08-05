import { pageHandler, dataHandler, saveHandler, testNotifHandler } from "./Handler.js";

const purRoute = [
    {
        url: '/pur_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/pur_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/pur_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/pur_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
]

export default purRoute;