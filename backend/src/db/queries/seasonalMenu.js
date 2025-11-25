import { sql } from "../../config/db.js";
import { getIngredientsForItem } from "./helpers.js";

/**
 * Retrieves all seasonal menu items from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the item_id, name, popularity, price, and an array of ingredient IDs associated with each seasonal menu item.
 */
export async function getSeasonalMenu() {
  const rows = await sql`
    SELECT item_id, item_name, item_popularity, price
    FROM seasonal_menu;
  `;

  // Fetch ingredient ids for each seasonal item in parallel
  return Promise.all(
    rows.map(async (row) => ({
      id: row.item_id,
      name: row.item_name,
      popularity: row.item_popularity,
      price: row.price,
      ingredients: await getIngredientsForItem(row.item_id),
    }))
  );
}

/**
 * Adds a new seasonal menu item to the database.
 *
 * @param {string} name The name of the new seasonal menu item.
 * @param {number} popularity The popularity of the new seasonal menu item.
 * @param {number} price The price of the new seasonal menu item.
 * @returns {Promise<number>} A promise that resolves to the item_id of the created seasonal menu item.
 * @throws {Error} If the insert fails to return an item_id.
 */
export async function addSeasonalMenuItem(name, popularity, price) {
  const rows = await sql`
    INSERT INTO seasonal_menu (item_name, item_popularity, price, start_time, end_time)
    VALUES (${name}, ${popularity}, ${price}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days')
    RETURNING item_id;
  `;

  if (rows.length === 0) {
    throw new Error("Failed to insert seasonal menu item: no ID returned");
  }

  return rows[0].item_id;
}

/**
 * Deletes a seasonal menu item from the database.
 *
 * @param {number} id The item_id of the seasonal menu item to delete.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the item_id of the deleted seasonal menu item, or null if the item does not exist.
 * @throws {Error} If the item ID is not provided.
 */
export async function deleteSeasonalItem(id) {
  if (id == null) {
    throw new Error("Missing seasonal item id!");
  }

  const rows = await sql`
    DELETE FROM seasonal_menu
    WHERE item_id = ${id}
    RETURNING item_id;
  `;

  if (rows.length === 0) {
    // No row deleted
    return null;
  }

  return { item_id: rows[0].item_id };
}

/**
 * Updates the price of a seasonal menu item.
 *
 * @param {number} id The item_id of the seasonal menu item to update.
 * @param {number} price The new price of the seasonal menu item.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the item_id and price of the updated seasonal menu item, or null if the item does not exist.
 * @throws {Error} If the item ID or price is not provided.
 */
export async function updateSeasonalPrice(id, price) {
  if (id == null) {
    throw new Error("Missing seasonal item id!");
  }
  if (price == null) {
    throw new Error("Missing price for seasonal item update!");
  }

  const rows = await sql`
    UPDATE seasonal_menu
    SET price = ${price}
    WHERE item_id = ${id}
    RETURNING item_id, price;
  `;

  if (rows.length === 0) {
    return null; // caller can turn this into 404
  }

  return {
    item_id: rows[0].item_id,
    price: rows[0].price,
  };
}