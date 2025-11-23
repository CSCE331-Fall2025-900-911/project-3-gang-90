import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import employeesRouter from './api/routes/employees.js'
import menuRouter from './api/routes/menu.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/logging.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(requestLogger);

// Routes from api/routes
app.use('/api/employees', employeesRouter);
app.use('/api/menu', menuRouter);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).send('IM RUNNING FINE BITCH FUCK YOU LOOKING AT');
})

export default app