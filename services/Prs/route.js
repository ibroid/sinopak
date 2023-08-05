import { pageHandler, dataHandler, saveHandler, testNotifHandler } from "./Handler.js";

const prsRoute = [
    {
        url: '/prs_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/prs_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/prs_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/prs_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
]

export default prsRoute;