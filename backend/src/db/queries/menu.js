import { sql } from "../../config/db.js";

import { getIngredientsForItem } from "./helpers.js";

/**
 * Retrieves all menu items from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the item_id, name, price, is_active, and item_popularity fields of all menu items, as well as an array of ingredient IDs associated with each item.
 */
export async function getMenu() {
    const rows = await sql`SELECT item_id, item_name, price, is_active, item_popularity FROM menu;`;
    return Promise.all(rows.map(async (row) => ({
        id: row.item_id,
        name: row.item_name,
        popularity: row.item_popularity,
        price: row.price,
        stat: row.is_active,
        ingredients: await getIngredientsForItem(row.item_id),
    })));
}

/**
 * Retrieves all active menu items from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the item_id, name, price, is_active, and item_popularity fields of all active menu items, as well as an array of ingredient IDs associated with each item.
 */
export async function getActiveMenu() {
    const rows = await sql`SELECT item_id, item_name, price, is_active, item_popularity FROM menu WHERE is_active = TRUE;`;
    return Promise.all(rows.map(async (row) => ({
        id: row.item_id,
        name: row.item_name,
        popularity: row.item_popularity,
        price: row.price,
        stat: row.is_active,
        ingredients: await getIngredientsForItem(row.item_id),
    })));
}

/**
 * Retrieves the item_id of a menu item given its name.
 *
 * @param {string} item_name The name of the menu item to retrieve the item_id for.
 * @returns {Promise<number|null>} A promise that resolves to the item_id of the menu item if it exists, or null if no item with the given name exists or if there are multiple items with the same name.
 */
export async function getItemId(itemName) {
    const rows = await sql`SELECT item_id, item_name 
    FROM menu
    WHERE item_name = ${itemName};`;

    if (rows.length === 0) { return null; }
    if (rows.length > 1) { 
        console.warn(`Found ${rows.length} items with name ${itemName}!`);
        return null;
    }
    return rows[0].item_id;
}

/**
 * Retrieves an array of objects containing the ingredient_id, ingredient_name, quantity, and category fields of all ingredients associated with the given menu item.
 *
 * @param {number} id The item_id of the menu item to retrieve the ingredients for.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the ingredient_id, ingredient_name, quantity, and category fields of all ingredients associated with the given menu item.
 */
export async function getItemIngredients(id) {
    const rows = await sql`
        SELECT i.ingredient_id, i.ingredient_name, i.quantity, i.category
        FROM ingredients i
        JOIN ingredients_map m ON m.ingredient_id = i.ingredient_id
        WHERE m.item_id = ${id};
    `;

    return rows.map((row) => ({
        id: row.ingredient_id,
        name: row.ingredient_name,
        quantity: row.quantity,
        category: row.category,
    }));
}

/**
 * Adds an ingredient to a menu item.
 *
 * @param {number} itemId The item_id of the menu item to add the ingredient to.
 * @param {number} ingredientId The ingredient_id of the ingredient to add.
 * @param {boolean} isSeasonal Whether the ingredient is seasonal or not.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, item_id, and is_seasonal fields of the added ingredient.
 */
export async function addIngredientToItem(itemId, ingredientId, isSeasonal) {
    const rows = await sql`
        INSERT INTO ingredients_map (ingredient_id, item_id, is_seasonal) VALUES (${ingredientId}, ${itemId}, ${isSeasonal})
        RETURNING ingredient_id, item_id, is_seasonal;
    `;

    return rows[0];
}

/**
 * Removes an ingredient from a menu item.
 *
 * @param {number} itemId The item_id of the menu item to remove the ingredient from.
 * @param {number} ingredientId The ingredient_id of the ingredient to remove.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the item_id and ingredient_id fields of the removed ingredient, or null if no item with the given item_id and ingredient_id exists or if there are multiple items with the same item_id and ingredient_id.
 */
export async function removeIngredientFromItem(itemId, ingredientId) {
    const rows = await sql`
        DELETE FROM ingredients_map WHERE item_id = ${itemId} AND ingredient_id = ${ingredientId}
        RETURNING item_id, ingredient_id;
    `;
    if (rows.length === 0) { return null; }
    else if (rows.length > 1) {
        console.warn(`Found ${rows.length} items with id ${itemId}!`);
    }

    return rows[0];
}

/**
 * Adds a new menu item to the database.
 *
 * @param {string} name The name of the menu item to add.
 * @param {number} popularity The popularity of the menu item to add.
 * @param {number} price The price of the menu item to add.
 * @returns {Promise<number>} A promise that resolves to the item_id of the added menu item.
 */
export async function addMenuItem(name, popularity, price) {
    const res = await sql`
        INSERT INTO menu (item_name, item_popularity, price)
        VALUES (${name}, ${popularity}, ${price}) RETURNING item_id;
    `;

    return res[0].item_id;
}

/**
 * Updates the price of a menu item.
 *
 * @param {number} id The item_id of the menu item to update.
 * @param {number} price The new price of the menu item.
 */
export async function updateMenuPrice(id, price) {
    const rows = await sql`
        UPDATE menu
        SET price = ${price}
        WHERE item_id = ${id};
    `;
    if (rows.length === 0) { return null; }
    else if (rows.length > 1) {
        console.warn(`Found ${rows.length} items with id ${id}!`);
    }

    return rows[0];
}

/**
 * Deletes a menu item from the database.
 *
 * @param {number} id The item_id of the menu item to delete.
 */
export async function deleteItem(id) {
    const rows = await sql`
        DELETE FROM menu WHERE item_id = ${id}
        RETURNING item_id;
    `;

    if (rows.length === 0) { return null; }
    else if (rows.length > 1) {
        console.warn(`Found ${rows.length} items with id ${id}!`);
    }

    return rows[0];
}

/**
 * Retires a menu item from the database.
 * 
 * @param {number} id The item_id of the menu item to retire.
 */
export async function retireItem(id) {
    const rows = await sql`
        UPDATE menu
        SET is_active = FALSE
        WHERE item_id = ${id}
        RETURNING item_id;
    `;

    if (rows.length === 0) { return null; }
    else if (rows.length > 1) {
        console.warn(`Found ${rows.length} items with id ${id}!`);
    }

    return rows[0];
}