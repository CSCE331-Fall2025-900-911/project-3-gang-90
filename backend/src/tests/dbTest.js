import { sql } from "../config/db.js";

async function testSSL() {
    try {
        const [row] = await sql`SHOW ssl;`;
        console.log("ssl:", row);
    }
    catch (err) {
        console.error(err);
    } 
    finally {
        sql.end();
    }
}

testSSL();