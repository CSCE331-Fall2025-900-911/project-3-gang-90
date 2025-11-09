import postgres from 'postgres';


const sql = postgres(process.env.DATABASE_URL);



export async function getMangers(){
    let mangers =await sql`SELECT * FROM personnel WHERE role = 'manager' AND is_active = TRUE;`;
    return mangers;
}

export async function getEmployee(){
    let employee = await sql`SELECT * FROM personnel WHERE is_active = TRUE;`;
    return employee;
}

export async function addEmployee(name, role, pay, state){
    if(name == undefined){
        throw new Error("undifined name");
    }
    if(role == undefined){
        throw new Error("undifined role");
    }
    if(pay == undefined){
        throw new Error("undifined pay");
    }
    if(state == undefined){
        throw new Error("undifined state");
    }


    await sql`INSERT INTO personnel (name, role, pay, is_active) VALUES (${name}, ${role}, ${pay}, ${state});`;

}





export async function getMenu(){
    //this sql syntax already handle sql injections see https://github.com/porsager/postgres
    const items = await sql`SELECT * FROM menu;`;
    return items;
}



export async function addTransactionAndDetails(transaction, items){
    if(transaction["customerName"]== undefined){
        throw new Error("undifined customerName");
    }
    if(transaction["transactionTime"]== undefined){
        throw new Error("undifined transactionTime");
    }
    if(transaction["employeeId"]== undefined){
        throw new Error("undifined employeeId");
    }
    if(transaction["transactionTime"]== undefined){
        throw new Error("undifined transactionTime");
    }
    if(transaction["totalPrice"]== undefined){
        throw new Error("undifined totalPrice");
    }

    let transactionId = await addTransaction(transaction["customerName"], transaction["transactionTime"], transaction["employeeId"], transaction["totalPrice"]);

    for(i = 0 ; i < items.length(); i++){
        items[i]["transactionId"] = transactionId["transaction_id"];
    }


    sql`INSERT INTO transaction_details (transaction_id, item_id) VALUES ${sql(items,  "transaction_id", "itemId")}`;

}


async function addTransaction(customerName, transactionTime, employeeId, totalPrice){
    const transactionId = sql`INSERT INTO transactions (customer_name, transaction_time, employee_id, total_price)
                            VALUES (${customerName},${transactionTime},${employeeId},${totalPrice})
    
    `;


    return transactionId;






}