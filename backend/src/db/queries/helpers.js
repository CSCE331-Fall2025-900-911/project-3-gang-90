import { sql } from "../../config/db.js";

/**
 * Retrieves an array of ingredient IDs associated with the given item ID.
 *
 * @param {number} id The item ID to retrieve the ingredients for.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of ingredient IDs.
 * @throws {Error} If the item ID is not provided.
 */
export async function getIngredientsForItem(id) {
    if (id == null) { throw new Error("Missing item id!"); }
    const rows = await sql`
        SELECT ingredient_id 
        FROM ingredients_map 
        WHERE item_id = ${id};
        `;
    return rows.map((row) => row.ingredient_id);
}