import { pageHandler, dataHandler, saveHandler, testNotifHandler } from "./Handler.js";

const ptsRoute = [
    {
        url: '/pts_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/pts_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/pts_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/pts_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
]

export default ptsRoute;