import db from '../db/index.js';

export async function findAll() {
  const result = await db.query('SELECT * FROM menu');
  return result.rows;
}