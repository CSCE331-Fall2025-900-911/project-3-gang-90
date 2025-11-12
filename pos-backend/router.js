
import express from "express";
import * as menuQueries from "./Queries/menuQueries.js"
 const router = express.Router();

// MAKE SURE TO FOLLOW FORMAT FOR JSON OBJECTS EXACTLY

 /**
  * WHERE API ENDPOINTS ARE
  * 
  * 
  * 
  * 
  * @returns 
  */
router.get('/menu', async (req, res)=>{
    console.log("in get api endpoint");
    let data = await menuQueries.getMenu();
    res.json(data);
    }
)

/**
 * @param transaction as {customerName: string, transactionTime: DateTime, employeeId:int, totalPrice:double }
 * @param item as [{itemId:int}]
 * 
 */
router.post('/menu/TransactionAndDetails', async (req, res)=>{

    try{
    let data = await menuQueries.addTransactionAndDetails(req.body["transaction"], req.body["item"]);

    
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
        let data = await menuQueries.getEmployee();
        res.json(data);
    }
)
export default router;