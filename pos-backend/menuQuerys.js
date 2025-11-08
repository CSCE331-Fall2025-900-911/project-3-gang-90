import postgres from 'postgres';


const sql = postgres(process.env.DATABASE_URL);


export async function getMenu(){
    //this sql syntax already handle sql injections see https://github.com/porsager/postgres
    const items = await sql`SELECT * FROM menu`;
    return items;
}