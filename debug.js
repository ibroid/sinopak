import { prisma } from "./db/sinopak.js";

prisma.notifikasi.findFirst({
    where: {
        id: 1
    }
}).then(res => console.log(res))