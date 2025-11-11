
import express from "express";
import * as menuQuerys from "./menuQuerys.js"
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
  try{
    console.log("in get api endpoint");
    let data = await menuQuerys.getMenu();
    res.status(200).json({success:true, data});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false, erorr:err.toString()})
  }
    }
)

/**
 * @param transaction as {customerName: string, transactionTime: DateTime, employeeId:int, totalPrice:double }
 * @param item as [{itemId:int}]
 * 
 */
router.post('/menu/TransactionAndDetails', async (req, res) => {
  try {
    let data = await menuQuerys.addTransactionAndDetails(
      req.body.transaction,
      req.body.item
    );

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.toString() });
  }
});


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
      try{
        //console.log("in /employees");
        let data = await menuQuerys.getEmployee();
        return res.status(200).json({sucess:true, data});
      }catch(err){
        console.error(err)
        return res.status(500).json({success:true, error:err.toString()})
      }
    }
)
export default router;