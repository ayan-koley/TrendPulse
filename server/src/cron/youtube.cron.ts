import corn from 'node-cron';
import { processTrendingVideos } from '../services/processors/youtube.processors.ts';


export const startYoutubeCron = (): void => {
    corn.schedule("0 */1 * * *", async() => {
        console.log("Running youtube cron job");
        await processTrendingVideos();
    })
}