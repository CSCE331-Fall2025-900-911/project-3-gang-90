import { sql } from "../../config/db.js";

/**
 * Retrieves all ingredients from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the ingredient_id, ingredient_name, quantity, and category fields of all ingredients.
 */
export async function getIngredients() {
  const rows = await sql`
    SELECT ingredient_id, ingredient_name, quantity, category
    FROM ingredients;
  `;

  return rows.map((row) => ({
    id: row.ingredient_id,
    name: row.ingredient_name,
    quantity: row.quantity,
    category: row.category,
  }));
}

/**
 * Retrieves the ingredient_id of an ingredient given its name.
 * 
 * @param {string} ingredientName The name of the ingredient to retrieve the id for.
 * @returns {Promise<number|null>} A promise that resolves to the ingredient_id of the ingredient if found, or null if not found. If multiple ingredients are found with the same name, logs a warning and returns the first one.
 */
export async function getIngredientId(ingredientName) {
  const rows = await sql`
    SELECT ingredient_id
    FROM ingredients
    WHERE ingredient_name = ${ingredientName};
  `;

  if (rows.length === 0) {
    return null;
  }

  if (rows.length > 1) {
    console.warn(
      `[ingredients.getIngredientId] Multiple ingredients found with name "${ingredientName}". Returning first.`
    );
  }

  return rows[0].ingredient_id;
}

/**
 * Refills the inventory of an ingredient given its name and the quantity to be added.
 *
 * @param {string} ingredientName The name of the ingredient to refill.
 * @param {number} quantity The quantity to be added to the ingredient.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the refilled ingredient, or null if the ingredient is not found.
 * @throws {Error} If the quantity is negative.
 */
export async function refillInventory(ingredientName, quantity) {
  if (quantity < 0) {
    throw new Error("Quantity cannot be negative.");
  }

  const rows = await sql`
    UPDATE ingredients
    SET quantity = quantity + ${quantity}
    WHERE ingredient_name = ${ingredientName}
    RETURNING ingredient_id, ingredient_name, quantity, category;
  `;

  if (rows.length === 0) {
    return null; // ingredient not found
  }

  const row = rows[0];
  return {
    id: row.ingredient_id,
    name: row.ingredient_name,
    quantity: row.quantity,
    category: row.category,
  };
}

/**
 * Decreases the inventory of an ingredient given its id and the quantity to be subtracted.
 * 
 * @param {number} ingredientId The id of the ingredient to decrease the inventory of.
 * @param {number} quantity The quantity to be subtracted from the ingredient.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the decreased ingredient, or null if the ingredient is not found.
 * @throws {Error} If the quantity is negative.
 */
export async function decreaseInventory(ingredientId, quantity) {
  if (quantity < 0) {
    throw new Error("Quantity cannot be negative.");
  }

  const rows = await sql`
    UPDATE ingredients
    SET quantity = quantity - ${quantity}
    WHERE ingredient_id = ${ingredientId}
    RETURNING ingredient_id, ingredient_name, quantity, category;
  `;

  if (rows.length === 0) {
    return null; // ingredient not found
  }

  const row = rows[0];
  return {
    id: row.ingredient_id,
    name: row.ingredient_name,
    quantity: row.quantity,
    category: row.category,
  };
}

/**
 * Inserts a new ingredient into the database.
 * 
 * @param {string} name The name of the ingredient to add.
 * @param {number} quantity The quantity of the ingredient to add.
 * @param {string} category The category of the ingredient to add.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the added ingredient.
 * @throws {Error} If the insert fails for any reason.
 */
export async function addIngredient(name, quantity, category) {
  const rows = await sql`
    INSERT INTO ingredients (ingredient_name, quantity, category)
    VALUES (${name}, ${quantity}, ${category})
    RETURNING ingredient_id, ingredient_name, quantity, category;
  `;

  if (rows.length === 0) {
    throw new Error("Failed to insert ingredient: no row returned");
  }

  const row = rows[0];
  return {
    id: row.ingredient_id,
    name: row.ingredient_name,
    quantity: row.quantity,
    category: row.category,
  };
}

/**
 * Updates an existing ingredient in the database.
 * 
 * @param {number} id The id of the ingredient to update.
 * @param {string} name The new name of the ingredient.
 * @param {number} quantity The new quantity of the ingredient.
 * @param {string} category The new category of the ingredient.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the updated ingredient, or null if the ingredient is not found.
 * @throws {Error} If the update fails for any reason.
 */
export async function updateIngredient(id, name, quantity, category) {
  const rows = await sql`
    UPDATE ingredients
    SET ingredient_name = ${name},
        quantity = ${quantity},
        category = ${category}
    WHERE ingredient_id = ${id}
    RETURNING ingredient_id, ingredient_name, quantity, category;
  `;

  if (rows.length === 0) {
    return null; // ingredient not found
  }

  const row = rows[0];
  return {
    id: row.ingredient_id,
    name: row.ingredient_name,
    quantity: row.quantity,
    category: row.category,
  };
}

/**
 * Deletes an ingredient from the database given its id.
 * 
 * @param {number} id The id of the ingredient to delete.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the ingredient_id field of the deleted ingredient, or null if nothing was deleted.
 */
export async function deleteIngredient(id) {
  const rows = await sql`
    DELETE FROM ingredients
    WHERE ingredient_id = ${id}
    RETURNING ingredient_id;
  `;

  if (rows.length === 0) {
    return null; // nothing deleted
  }

  return { id: rows[0].ingredient_id };
}

/**
 * Retrieves the usage count of all ingredients in the given time period.
 *
 * @param {number} start The start time of the period.
 * @param {number} end The end time of the period.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the ingredient_name and times_used fields of all ingredients used in the given period, sorted in descending order of usage count and then alphabetically by ingredient name.
 */
export async function getIngredientUsage(start, end) {
  const rows = await sql`
    SELECT i.ingredient_name, COUNT(*) AS times_used
    FROM transactions t
    JOIN transaction_details td ON td.transaction_id = t.transaction_id
    JOIN ingredients_map im ON im.item_id = td.item_id
    JOIN ingredients i ON i.ingredient_id = im.ingredient_id
    WHERE t.transaction_time >= ${start}
      AND t.transaction_time <= ${end}
    GROUP BY i.ingredient_name
    ORDER BY times_used DESC, i.ingredient_name;
  `;

  return rows.map((row) => ({
    name: row.ingredient_name,
    timesUsed: Number(row.times_used),
  }));
}

/**
 * Retrieves a list of all sales transactions in the given time period.
 *
 * @param {number} start The start time of the period.
 * @param {number} end The end time of the period.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the time and item_name fields of all sales transactions in the given period, sorted in descending order of transaction time and then alphabetically by item name.
 */
export async function getSalesReport(start, end) {
  const rows = await sql`
    SELECT m.item_name, t.transaction_time
    FROM transactions t
    JOIN transaction_details td ON td.transaction_id = t.transaction_id
    JOIN menu m ON td.item_id = m.item_id
    WHERE t.transaction_time >= ${start}
      AND t.transaction_time <= ${end}
    ORDER BY t.transaction_time DESC, m.item_name ASC;
  `;

  return rows.map((row) => ({
    time: row.transaction_time,
    itemName: row.item_name,
  }));
}