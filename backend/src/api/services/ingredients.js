import { ingredients as ingredientQueries } from "../../db/index.js";

/**
 * Retrieves all ingredients from the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the ingredient_id, ingredient_name, quantity, and category fields of all ingredients.
 */
export async function getIngredients() {
  return await ingredientQueries.getIngredients();
}

/**
 * Retrieves the ingredient_id of an ingredient given its name.
 * 
 * @param {string} name The name of the ingredient to retrieve the id for.
 * @returns {Promise<number|null>} A promise that resolves to the ingredient_id of the ingredient if found, or null if not found.
 * @throws {Error} If the ingredient name is not provided.
 */
export async function getIngredientIdByName(name) {
  if (!name) {
    throw new Error("Ingredient name is required");
  }

  return await ingredientQueries.getIngredientId(name);
}

/**
 * Refills the inventory of an ingredient given its name and the quantity to be added.
 * 
 * @param {string} name The name of the ingredient to refill.
 * @param {number} quantity The quantity to be added to the ingredient.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the refilled ingredient, or null if the ingredient is not found.
 * @throws {Error} If the name or quantity is not provided.
 */
export async function refillInventoryByName(name, quantity) {
  if (!name) {
    throw new Error("Ingredient name is required to refill inventory");
  }

  if (quantity == null) {
    throw new Error("Quantity is required to refill inventory");
  }

  return await ingredientQueries.refillInventory(name, quantity);
}

/**
 * Decreases the inventory of an ingredient given its id and the quantity to be subtracted.
 *
 * @param {number} id The id of the ingredient to decrease the inventory of.
 * @param {number} quantity The quantity to be subtracted from the ingredient.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the decreased ingredient, or null if the ingredient is not found.
 * @throws {Error} If the id or quantity is not provided.
 */
export async function decreaseInventoryById(id, quantity) {
  if (id == null) {
    throw new Error("Ingredient id is required to decrease inventory");
  }

  if (quantity == null) {
    throw new Error("Quantity is required to decrease inventory");
  }

  return await ingredientQueries.decreaseInventory(id, quantity);
}

/**
 * Creates a new ingredient in the database.
 *
 * @param {Object} data - The data to create the ingredient with. name, quantity, and category are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the created ingredient.
 * @throws {Error} If the name, quantity, or category is not provided.
 */
export async function createIngredient({ name, quantity = 0, category }) {
  if (!name) {
    throw new Error("Ingredient name is required");
  }

  if (quantity == null) {
    throw new Error("Quantity is required to create an ingredient");
  }

  if (!category) {
    throw new Error("Category is required to create an ingredient");
  }

  return await ingredientQueries.addIngredient(name, quantity, category);
}

/**
 * Updates an existing ingredient in the database.
 *
 * @param {Object} data - The data to update the ingredient with. id, name, quantity, and category are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the updated ingredient.
 * @throws {Error} If the id, name, quantity, or category is not provided.
 */
export async function updateIngredient({ id, name, quantity, category }) {
  if (id == null) {
    throw new Error("Ingredient id is required to update an ingredient");
  }

  if (!name) {
    throw new Error("Ingredient name is required to update an ingredient");
  }

  if (quantity == null) {
    throw new Error("Quantity is required to update an ingredient");
  }

  if (!category) {
    throw new Error("Category is required to update an ingredient");
  }

  return await ingredientQueries.updateIngredient(id, name, quantity, category);
}

/**
 * Deletes an ingredient from the database.
 *
 * @param {number} id The id of the ingredient to delete.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the ingredient_id field of the deleted ingredient, or null if no ingredient with the given id exists.
 * @throws {Error} If the id is not provided.
 */
export async function deleteIngredientById(id) {
  if (id == null) {
    throw new Error("Ingredient id is required to delete an ingredient");
  }

  return await ingredientQueries.deleteIngredient(id);
}

/**
 * Retrieves the usage count of all ingredients in the given time period.
 * 
 * @param {number} start The start time of the period.
 * @param {number} end The end time of the period.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the ingredient_name and times_used fields of all ingredients used in the given period, sorted in descending order of usage count and then alphabetically by ingredient name.
 * @throws {Error} If the start or end timestamps are not provided.
 */
export async function getIngredientUsage(start, end) {
  if (!start || !end) {
    throw new Error("start and end timestamps are required to get ingredient usage");
  }

  return await ingredientQueries.getIngredientUsage(start, end);
}

/**
 * Retrieves a list of all sales transactions in the given time period.
 * 
 * @param {number} start The start time of the period.
 * @param {number} end The end time of the period.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the time and item_name fields of all sales transactions in the given period, sorted in descending order of transaction time and then alphabetically by item name.
 * @throws {Error} If the start or end timestamps are not provided.
 */
export async function getSalesReport(start, end) {
  if (!start || !end) {
    throw new Error("start and end timestamps are required to get sales report");
  }

  return await ingredientQueries.getSalesReport(start, end);
}