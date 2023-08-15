import { pageHandler, dataHandler, saveHandler, testNotifHandler } from "./Handler.js";

const spvRoute = [
    {
        url: '/spv_page',
        method: 'GET',
        handler: pageHandler
    },
    {
        url: '/spv_data',
        method: 'GET',
        handler: dataHandler
    },
    {
        url: '/spv_update',
        method: 'POST',
        handler: saveHandler
    },
    {
        url: '/spv_test_notif',
        method: 'POST',
        handler: testNotifHandler
    },
    {
        url: '/api/spv',
        method: 'POST',
        handler: (req, res) => {
            console.log(req.body)
            return {
                status: 'ok'
            }
        }
    },
]

export default spvRoute;