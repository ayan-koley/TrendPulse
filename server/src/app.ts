import express, { urlencoded } from 'express';
import { processTrendingVideos } from './services/processors/youtube.processors.ts';
import { startYoutubeCron } from './cron/youtube.cron.ts';
import cors from 'cors'

const app = express();
app.use(urlencoded({
    extended: true,
    inflate: true,
    limit: '100kb',
    parameterLimit: 5000
}))
app.use(express.json({
    limit: '100kb',
    strict: true,
}))

app.use(cors({
    origin: '*',
    credentials: true,
}))

startYoutubeCron();

import dashboardRoute from './routes/dashboard.routes.ts'

app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/health", (req, res, next) => {
    return res.status(200).json({message: "server is running"});
})

export default app;