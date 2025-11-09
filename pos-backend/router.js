
import express from "express";
import * as menuQuerys from "./menuQuerys.js"
 const router = express.Router();


router.get('/menu', async (req, res)=>{
    console.log("in get api endpoint");
    let data = await menuQuerys.getMenu();
    res.json(data);
    }
)


router.post('/menu/TransactionAndDetails', async (req, res)=>{

    try{
    let data = await menuQuerys.addTransactionAndDetails(req.body["transaction"], req.body["item"]);

    
    console.log(req);
    }catch{
        
    }
    }
)


router.get('/employees', (req, res)=>{
    console.log("in /employees");
    
    res.json({conection:'connectd!'});
    }
)
export default router;