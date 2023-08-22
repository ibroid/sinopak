import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
// import 'dotenv/config';
import tasks from './cron.js';
import fastifyWebsocket from "@fastify/websocket";
import { websocket } from './webshock.js';

const fastify = Fastify()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyCors, {
    origin: "*"
})

fastify.register(fastifyWebsocket)

fastify.register(async function (core) {
    core.get("/log_event", { websocket: true }, (conn) => {
        conn.socket.on("message", msg => {
            conn.socket.send(JSON.stringify({
                event: "connected",
                payload: "ok"
            }))
        })

        websocket.set("web", conn.socket)
    })
})


fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
})

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'node_modules'),
    prefix: '/modules/',
    decorateReply: false // the reply decorator has been added by the first plugin registration
})

routes.forEach(route => {
    fastify.route(route)
})

try {
    await fastify.listen(
        {
            port: process.env.HTTP_PORT,
            host: process.env.HTTP_URL
        });
    console.log('running on ' + process.env.HTTP_PORT)
    tasks.start();
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}