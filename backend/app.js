import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import checkUser from "./routeMiddleware/checkUser.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DBURI)
    .then(() => app.listen(3000))
    .catch((err) => console.log(err));

app.get('*', checkUser);
app.use('/', router)