import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
// import 'dotenv/config';

const fastify = Fastify()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyCors, {
    origin: "*"
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
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}