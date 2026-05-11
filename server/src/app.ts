import express, { urlencoded } from 'express';

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

export default app;