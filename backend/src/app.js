import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';
import { config } from './config/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
  origin: config.clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Accept'],
}));

app.use('/', router);

export default app;