
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
    console.log("finished api")
    res.status(200).json({success:true, data});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false, erorr:err.toString()})
  }})


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
      }})


//seasonal menu endpoint
router.get("/menu/seasonal", async (req, res) => {
  try {
    const data = await menuQuerys.getSeasonalMenu();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load seasonal menu" });
  }
});

//add menu item endpoint
router.post("/menu", async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const newId = await menuQuerys.addMenuItem({ name, price, quantity });
    res.status(201).json({ id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

//add seasonal menu item
router.post("/menu/seasonal", async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const newId = await menuQuerys.addSeasonalMenuItem({ name, price, quantity }); //todo
    res.status(201).json({ id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add seasonal item" });
  }
});


router.post('/usage', async (req, res) => {
  try {
    let data = await menuQuerys.getIngredientUsage(
      req.body.start,
      req.body.end
    );
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.toString() });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const data = await menuQuerys.getTransactions();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.toString() });
  }
});

export default router;