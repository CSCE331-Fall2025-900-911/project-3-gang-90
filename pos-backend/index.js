import express from "express";
import helmet from 'helmet';
import cors from 'cors';
import router from "./api/router.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    "http://localhost:5173",
    "https://project-3-gang-90.vercel.app"
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Accept']
}));

app.use("/", router);

app.listen(port, (error) => {
    console.log("Listening on: ", port);
    if (error) {
        throw error;
    }
});

export default app;
