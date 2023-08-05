import { pageHandler, dataHandler, saveHandler, testNotifHandler } from "./Handler.js";

const pacRoute = [
    {
        url: '/pac_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/pac_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/pac_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/pac_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
]

export default pacRoute;