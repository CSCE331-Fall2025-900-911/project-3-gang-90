import { seasonalMenu as seasonalMenuQueries } from "../../db/index.js";

/**
 * Service layer for seasonal menu operations.
 *
 * This sits between controllers (HTTP) and the raw DB queries.
 * It can enforce business rules, do validation, and compose
 * multiple query calls when needed.
 */


/**
 * Retrieves all seasonal menu items from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the item_id, name, popularity, and price of each seasonal menu item.
 */
export async function getSeasonalMenu() {
  return await seasonalMenuQueries.getSeasonalMenu();
}

/**
 * Creates a new seasonal menu item in the database.
 *
 * @param {Object} options - An object containing the fields for the new seasonal menu item.
 * @param {string} options.name - The name of the new seasonal menu item.
 * @param {number} [options.popularity=0] - The popularity of the new seasonal menu item. Defaults to 0.
 * @param {number} options.price - The price of the new seasonal menu item.
 * @returns {Promise<Object>} A promise that resolves to an object containing the item_id, name, popularity, and price fields of the new seasonal menu item.
 * @throws {Error} If the name or price of the menu item is not provided.
 */
export async function createSeasonalMenuItem({ name, popularity = 0, price }) {
  if (!name || price == null) {
    throw new Error("name and price are required to create a seasonal menu item");
  }

  const id = await seasonalMenuQueries.addSeasonalMenuItem(name, popularity, price);

  return { id, name, popularity, price };
}

/**
 * Updates the price of a seasonal menu item.
 *
 * @param {number} id - The item_id of the seasonal menu item to update the price for.
 * @param {number} price - The new price of the seasonal menu item.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the item_id, name, popularity, and price fields of the updated seasonal menu item, or null if no such item exists.
 * @throws {Error} If the item ID or price is not provided.
 */
export async function updateSeasonalMenuPriceById(id, price) {
  if (id == null || price == null) {
    throw new Error("id and price are required to update seasonal menu price");
  }

  const updated = await seasonalMenuQueries.updateSeasonalPrice(id, price);
  return updated; // may be null if no such item exists
}

/**
 * Deletes a seasonal menu item from the database.
 *
 * @param {number} id - The item_id of the seasonal menu item to delete.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the item_id of the deleted seasonal menu item, or null if no such item exists.
 * @throws {Error} If the item ID is not provided.
 */
export async function deleteSeasonalMenuItem(id) {
  if (id == null) {
    throw new Error("Item id is required to delete a seasonal menu item");
  }

  const result = await seasonalMenuQueries.deleteSeasonalItem(id);
  return result; // may be null if nothing was deleted
}