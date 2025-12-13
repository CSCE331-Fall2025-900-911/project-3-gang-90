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

export async function checkStock(itemName) {
    if (itemName == null) { throw new Error("Missing item name!"); }
    const rows = await sql`
        SELECT i.ingredient_name, i.quantity
        FROM menu m
        JOIN ingredients_map im
            ON m.item_id = im.item_id
        JOIN ingredients i
            ON i.ingredient_id = im.ingredient_id
        WHERE m.item_name = ${itemName} AND is_active = TRUE;
        `;
    
    return rows.map((row) => ({
        name: row.ingredient_name,
        quantity: row.quantity
    }));
}

/**
 * Checks ingredient stock for a menu item by item_id.
 *
 * IMPORTANT: Pass a transaction client (e.g., `tx` from `sql.begin`) to ensure
 * stock checks are consistent with the surrounding transaction.
 *
 * @param {number} itemId The menu item_id.
 * @param {(template: TemplateStringsArray, ...args: any[]) => Promise<any[]>} client
 *   SQL client to use (defaults to global `sql`). Pass `tx` for transactional safety.
 * @returns {Promise<Array<{name: string, quantity: number}>>}
 */
export async function checkStockByItemId(itemId, client = sql) {
    if (itemId == null) { throw new Error("Missing item id!"); }

    const rows = await client`
        SELECT i.ingredient_name, i.quantity
        FROM menu m
        JOIN ingredients_map im
            ON m.item_id = im.item_id
        JOIN ingredients i
            ON i.ingredient_id = im.ingredient_id
        WHERE m.item_id = ${itemId}
          AND m.is_active = TRUE;
    `;

    return rows.map((row) => ({
        name: row.ingredient_name,
        quantity: row.quantity,
    }));
}

/**
 * Decrements stock for all ingredients used by a menu item (by item_id).
 *
 * NOTE: This assumes a simple model where each ingredient mapped to the item
 * is decremented by 1.
 *
 * @param {number} itemId The menu item_id.
 * @param {(template: TemplateStringsArray, ...args: any[]) => Promise<any[]>} client
 *   SQL client to use (defaults to global `sql`). Pass `tx` for transactional safety.
 * @returns {Promise<any[]>} Rows returned by the UPDATE.
 */
export async function decrementStockByItemId(itemId, client = sql) {
    if (itemId == null) { throw new Error("Missing item id!"); }

    const rows = await client`
        UPDATE ingredients
        SET quantity = quantity - 1
        FROM ingredients_map im
        JOIN menu m
            ON m.item_id = im.item_id
        WHERE ingredients.ingredient_id = im.ingredient_id
          AND m.item_id = ${itemId}
          AND m.is_active = TRUE
          AND ingredients.quantity > 0
        RETURNING ingredient_name, quantity;
    `;

    if (rows.length === 0) {
        throw new Error("Insufficient stock or item not found");
    }

    return rows;
}

export async function decrementStock(itemName) {
    if (!itemName) { throw new Error("Missing item name!"); }

    const rows = await sql`
        UPDATE ingredients
        SET quantity = quantity - 1
        FROM ingredients_map im
        JOIN menu m
            ON m.item_id = im.item_id
        WHERE ingredients.ingredient_id = im.ingredient_id
          AND m.item_name = ${itemName}
          AND ingredients.quantity > 0
        RETURNING ingredient_name, quantity;
    `;

    if (rows.length === 0) {
        throw new Error("Insufficient stock or item not found");
    }

    return rows;
}