import  express from "express"

import  helmet from 'helmet'
import cors from 'cors'
import router from "./api/router.js";


const app = express();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(cors({
    origin: process.env.CLIENT || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Accept']

}))

app.use("/",router);


if(!process.env.VERCEL){
    app.listen(port, (error)=>{
        console.log("Listening on:", port);
        if(error){
            throw error;
        }
    })
}

export default (req, res) => app(req, res);

