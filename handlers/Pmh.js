/**
 * @type {import("fastify/types/route").RouteHandler}
 */
export function handlePage(req, res) {
    res.sendFile('pages/pmh.html')
}