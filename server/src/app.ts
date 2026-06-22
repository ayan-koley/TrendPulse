import express, { urlencoded } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';

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
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(cookieParser(process.env.COOKIE_SECRET));


import userRoute from './routes/user.routes.ts'
import trendRoute from './routes/trend.routes.ts'

app.use("/api/v1/users", userRoute);
app.use("/api/v1/trends", trendRoute);
app.use("/api/v1/health", (req, res, next) => {
    return res.status(200).json({message: "server is running"});
})

export default app;