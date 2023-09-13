import { pageHandler, dataHandler, saveHandler, testNotifHandler } from "./Handler.js";
import { startNotifSpv } from "./Notifikasi.js";

/**
 * @type {import("fastify/types/route").RouteOptions[]}
 */
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
        schema: {
            body: {
                type: 'object',
                properties: {
                    perkara_id: {
                        type: 'string',
                        nullable: false,
                        minLength: 1
                    }
                },
            }
        },
        handler: async (req, res) => {
            await startNotifSpv(req.body)
            return {
                status: 'ok',
                message: 'success'
            }
        }
    },
]

export default spvRoute;