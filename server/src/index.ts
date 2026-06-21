import 'dotenv/config';
import app from "./app.js";
import { initCronWorkers } from './workers/cron.worker.ts';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Server operating seamlessly on port ${PORT}`);
    initCronWorkers();
});