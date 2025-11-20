import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL);



export async function getMangers(){
  try {
    let managers = await sql`SELECT * FROM personnel WHERE role = 'manager' AND is_active = TRUE;`;
    return managers;
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

export async function getEmployee(){
  try {
    let employee = await sql`SELECT * FROM personnel WHERE is_active = TRUE;`;
    return employee;
  } catch (error) {
    console.log("ERROR: ", error)
  }
}

export async function addEmployee(name, role, pay, isActive) {
    if ((name == undefined) || (typeof name == "string")){
        throw new Error("Name is either empty or not a string");
    }
    if((role == undefined) || (typeof role == "string")){
        throw new Error("Role is either empty or not a string");
    }
    if((pay == undefined) || (typeof pay == "number")){
        throw new Error("Number is either empty or not a number");
    }
    if((isActive == undefined) || (typeof isActive == "boolean")){
        throw new Error("isActive is either empty or not a boolean");
    }

    await sql`INSERT INTO personnel (name, role, pay, is_active) VALUES (${name}, ${role}, ${pay}, ${isActive});`;

}





export async function getMenu(){
    //this sql syntax already handle sql injections see https://github.com/porsager/postgres
    try {
      const items = await sql`SELECT * FROM menu;`;
      return items;
    } catch (error){
      throw new Error("Error in database interaction: " + error)
    }
}

export async function getSeasonalMenu() {
  try {
    const items = await sql`SELECT * FROM seasonal_menu;`;
    return items;
  } catch (error) {
    throw new Error("Error in database interaction: " + error)
  }
}


export async function addTransactionAndDetails(transaction, items){
    if(transaction["customerName"]== undefined){
        throw new Error("undefined customerName");
    }
    if(transaction["transactionTime"]== undefined){
        throw new Error("undefined transactionTime");
    }
    if(transaction["employeeId"]== undefined){
        throw new Error("undefined employeeId");
    }
    if(transaction["totalPrice"]== undefined){
        throw new Error("undefined totalPrice");
    }
    console.log("items: ",items);
    console.log("transactions: ",transaction);
    let transactionId = await addTransaction(transaction["customerName"], transaction["transactionTime"], transaction["employeeId"], transaction["totalPrice"]);
    console.log(transactionId);
    for(let i = 0 ; i < items.length; i++){
        items[i]["transaction_id"] = transactionId[0]["transaction_id"];
        items[i]["item_id"] = items[i]["itemId"]
    }

    console.log(items);
    await sql`INSERT INTO transaction_details ${sql(items,  "transaction_id", "item_id")}`;

}


async function addTransaction(customerName, transactionTime, employeeId, totalPrice){
    const transactionId = await sql`INSERT INTO transactions (customer_name, transaction_time, employee_id, total_price)
                            VALUES (${customerName},${transactionTime},${employeeId},${totalPrice}) RETURNING transaction_id;`;
    return transactionId;
}

export async function addMenuItem({ name, price, quantity }) {
    const rows = await sql`
        INSERT INTO menu (name, price, popularity)
        VALUES (${name}, ${price}, ${quantity})
        RETURNING id;
    `;
    return rows[0].id;
}

export async function addSeasonalMenuItem({ name, price, quantity }) {
    const rows = await sql`
        INSERT INTO seasonal_menu (name, price, popularity)
        VALUES (${name}, ${price}, ${quantity})
        RETURNING id;
    `;
    return rows[0].id;


}


export async function getIngredientUsage(start, end){
  if(start == undefined){
    throw new Error("undefined start time");
  }
  if(end == undefined){
    throw new Error("undefined end time");
  }
  
  const rows = await sql`SELECT i.ingredient_name, COUNT(*) AS times_used 
                        FROM transactions t 
                        JOIN transaction_details td ON td.transaction_id = t.transaction_id 
                        JOIN ingredients_map im ON im.item_id = td.item_id 
                        JOIN ingredients i ON i.ingredient_id = im.ingredient_id 
                        WHERE t.transaction_time >= ${start} AND t.transaction_time <= ${end} 
                        GROUP BY i.ingredient_name
                        ORDER BY times_used DESC, i.ingredient_name`;

  return rows;
}