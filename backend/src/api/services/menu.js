import { menu as menuQueries } from "../../db/index.js";

/**
 * Service layer for menu-related operations.
 *
 * This sits between controllers (HTTP) and the raw DB queries.
 * It can enforce business rules, do validation, and compose
 * multiple query calls when needed.
 */


/**
 * Retrieves all menu items from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the item_id, name, price, is_active, and item_popularity fields of all menu items, as well as an array of ingredient IDs associated with each item.
 */
export async function getMenu() {
  return await menuQueries.getMenu();
}


/**
 * Retrieves all active menu items from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the item_id, name, price, is_active, and item_popularity fields of all active menu items, as well as an array of ingredient IDs associated with each item.
 */
export async function getActiveMenu() {
  return await menuQueries.getActiveMenu();
}


/**
 * Retrieves the item_id of a menu item given its name.
 *
 * @param {string} name The name of the menu item to retrieve the item_id for.
 * @returns {Promise<number|null>} A promise that resolves to the item_id of the menu item if it exists, or null if no item with the given name exists or if there are multiple items with the same name.
 * @throws {Error} If the item name is not provided.
 */
export async function getItemIdByName(name) {
  if (!name) {
    throw new Error("Item name is required");
  }

  return await menuQueries.getItemId(name);
}


/**
 * Retrieves an array of ingredient IDs associated with the given menu item.
 * 
 * @param {number} itemId The item_id of the menu item to retrieve the ingredients for.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of ingredient IDs.
 * @throws {Error} If the item ID is not provided.
 */
export async function getItemIngredients(itemId) {
  if (itemId == null) {
    throw new Error("Item id is required");
  }

  return await menuQueries.getItemIngredients(itemId);
}


/**
 * Adds an ingredient to a menu item.
 *
 * @param {number} itemId The item_id of the menu item to add the ingredient to.
 * @param {number} ingredientId The ingredient_id of the ingredient to add.
 * @param {boolean} isSeasonal Whether the ingredient is seasonal or not. Defaults to false.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, item_id, and is_seasonal fields of the added ingredient.
 * @throws {Error} If the item ID or ingredient ID is not provided.
 */
export async function addIngredientToItem(itemId, ingredientId, isSeasonal = false) {
  if (itemId == null || ingredientId == null) {
    throw new Error("itemId and ingredientId are required");
  }

  return await menuQueries.addIngredientToItem(itemId, ingredientId, isSeasonal);
}


/**
 * Removes an ingredient from a menu item.
 *
 * @param {number} itemId The item_id of the menu item to remove the ingredient from.
 * @param {number} ingredientId The ingredient_id of the ingredient to remove.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the item_id and ingredient_id fields of the removed ingredient, or null if no item with the given item_id and ingredient_id exists or if there are multiple items with the same item_id and ingredient_id.
 * @throws {Error} If the item ID or ingredient ID is not provided.
 */
export async function removeIngredientFromItem(itemId, ingredientId) {
  if (itemId == null || ingredientId == null) {
    throw new Error("itemId and ingredientId are required");
  }

  return await menuQueries.removeIngredientFromItem(itemId, ingredientId);
}


/**
 * Creates a new menu item.
 * 
 * @param {Object} options An object containing the fields for the new menu item.
 * @param {string} options.name The name of the new menu item.
 * @param {number} [options.popularity=0] The popularity of the new menu item. Defaults to 0.
 * @param {number} options.price The price of the new menu item.
 * @returns {Promise<Object>} A promise that resolves to an object containing the item_id, name, popularity, and price fields of the new menu item.
 * @throws {Error} If the name or price of the menu item is not provided.
 */
export async function createMenuItem({ name, popularity = 0, price }) {
  if (!name || price == null) {
    throw new Error("name and price are required to create a menu item");
  }

  // popularity is optional; defaults to 0
  const itemId = await menuQueries.addMenuItem(name, popularity, price);
  return { id: itemId, name, popularity, price };
}


/**
 * Updates the price of a menu item.
 *
 * @param {number} id The item_id of the menu item to update the price for.
 * @param {number} price The new price of the menu item.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} If the item ID or price is not provided.
 */
export async function updateMenuPriceById(id, price) {
  if (id == null || price == null) {
    throw new Error("id and price are required to update menu price");
  }

  await menuQueries.updateMenuPrice(id, price);
}


/**
 * Deletes a menu item from the database.
 * 
 * @param {number} id The item_id of the menu item to delete.
 * @throws {Error} If the item ID is not provided.
 * @returns {Promise<void>} A promise that resolves when the delete is complete.
 */
export async function deleteMenuItem(id) {
  if (id == null) {
    throw new Error("Item id is required to delete a menu item");
  }

  await menuQueries.deleteItem(id);
}



/**
 * Retires a menu item from the database.
 * 
 * @param {number} id The item_id of the menu item to retire.
 * @throws {Error} If the item ID is not provided.
 * @returns {Promise<void>} A promise that resolves when the retire is complete.
 */
export async function retireMenuItem(id) {
  if (id == null) {
    throw new Error("Item id is required to retire a menu item");
  }

  await menuQueries.retireItem(id);
}