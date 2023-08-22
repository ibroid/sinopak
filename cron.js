import cron from "node-cron";
import { startNotifPrs } from "./services/Prs/Notifikasi.js";

const dev = process.argv.includes('--dev')

const tasks = cron.schedule(dev ? '*/5 * * * *' : '5 8 * * *', () => {
    startNotifPrs()
})

export default tasks;