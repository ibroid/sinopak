import cron from "node-cron";
import { startNotifPrs } from "./services/Prs/Notifikasi.js";

const dev = process.argv.includes('--dev')

const tasks = cron.schedule(dev ? '*/5 * * * *' : process.env.SCHEDULE, () => {
    if (!dev) {
        startNotifPrs()
        // console.log('ok')
    }
})

export default tasks;