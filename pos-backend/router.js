
import express from "express";
import * as menuQuerys from "./menuQuerys.js"
 const router = express.Router();




 /**
  * 
  * 
  * 
  * 
  * 
  * @returns 
  */
router.get('/menu', async (req, res)=>{
    console.log("in get api endpoint");
    let data = await menuQuerys.getMenu();
    res.json(data);
    }
)

/**
 * @praam transaction as {customerName: string, transactionTime: DateTime, employeeId:int, totalPrice:double }
 * @praam item as [{itemId:int}]
 * 
 */
router.post('/menu/TransactionAndDetails', async (req, res)=>{

    try{
    let data = await menuQuerys.addTransactionAndDetails(req.body["transaction"], req.body["item"]);

    
    console.log(req);
    }catch{
        
    }
    }
)

/**
 * 
 * 
 * fetch /employees
 * 
 * 
 * 
 * @returns json object in the stlye of [{employee_id: int, name: string, role: string, pay: double, is_active: bolean}]
 */
router.get('/employees', async (req, res)=>{

        console.log("in /employees");
        let data = await menuQuerys.getEmployee();
        res.json(data);
    }
)
export default router;