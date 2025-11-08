import * as express from "express"

import * as helmet from 'helmet'
import * as cors from 'cors'

const app = express();

const port = 3000;


app.use(express.json());
app.use(express.urlencoded({extended:ture}));


app.use(cors({
    origin: process.env.SERVER,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-Requested-With', 'Conent-Type', Accept]

}))


app.listen(port, (error)=>{
    if(error){
        throw error;
    }

})

module.exports = app;

