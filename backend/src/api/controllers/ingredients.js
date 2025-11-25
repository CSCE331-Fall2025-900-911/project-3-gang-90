import * as ingredientsService from "../services/ingredients.js";

/**
 * Retrieves all ingredients from the database.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredients.
 * @throws {Error} If an unexpected error occurs while retrieving the ingredients.
 */
export async function getIngredients(req, res, next) {
  try {
    const ingredients = await ingredientsService.getIngredients();
    return res.status(200).json(ingredients);
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves the ingredient_id of an ingredient given its name.
 *
 * @param {Object} req.query - The query parameters of the request.
 * @param {string} req.query.name - The name of the ingredient to retrieve the id for.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id of the ingredient if found, or null if not found.
 * @throws {Error} If the ingredient name is not provided, or if an unexpected error occurs while retrieving the ingredient id.
 */
export async function getIngredientIdByName(req, res, next) {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Query parameter 'name' is required" });
    }

    const id = await ingredientsService.getIngredientIdByName(name);

    if (id == null) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    return res.status(200).json({ id });
  } catch (err) {
    return next(err);
  }
}

/**
 * Creates a new ingredient in the database.
 *
 * @param {Object} req.body - The data to create the ingredient with. name, quantity, and category are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the created ingredient.
 * @throws {Error} If the name, quantity, or category is not provided, or an unexpected error occurs while creating the ingredient.
 */
export async function createIngredient(req, res, next) {
  try {
    const { name, quantity, category } = req.body;

    if (!name || quantity == null || !category) {
      return res.status(400).json({ error: "name, quantity, and category are required" });
    }

    const ingredient = await ingredientsService.createIngredient({
      name,
      quantity,
      category,
    });

    return res.status(201).json(ingredient);
  } catch (err) {
    return next(err);
  }
}

/**
 * Updates an existing ingredient in the database.
 *
 * @param {Object} req.params - The params to update the ingredient with. id is required.
 * @param {Object} req.body - The data to update the ingredient with. name, quantity, and category are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the updated ingredient.
 * @throws {Error} If the ingredient id or name, quantity, or category is not provided, or an unexpected error occurs while updating the ingredient.
 */
export async function updateIngredient(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid ingredient id" });
    }

    const { name, quantity, category } = req.body;

    if (!name || quantity == null || !category) {
      return res.status(400).json({ error: "name, quantity, and category are required" });
    }

    const updated = await ingredientsService.updateIngredient({
      id,
      name,
      quantity,
      category,
    });

    if (!updated) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

/**
 * Deletes an ingredient from the database given its id.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {string} id The id of the ingredient to delete.
 *
 * @returns {Promise<void>} A promise that resolves when the delete is complete.
 * @throws {Error} If the item ID is not provided, or if the item ID is invalid.
 */
export async function deleteIngredient(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid ingredient id" });
    }

    const result = await ingredientsService.deleteIngredientById(id);

    if (!result) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

/**
 * Refills the inventory of an ingredient given its name and the quantity to be added.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @body {string} name The name of the ingredient to refill.
 * @body {number} quantity The quantity to be added to the ingredient.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the refilled ingredient.
 * @throws {Error} If the name or quantity is not provided, or if the ingredient is not found.
 */
export async function refillInventory(req, res, next) {
  try {
    const { name, quantity } = req.body;

    if (!name || quantity == null) {
      return res.status(400).json({ error: "name and quantity are required" });
    }

    const updated = await ingredientsService.refillInventoryByName(name, quantity);

    if (!updated) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

/**
 * Decreases the inventory of an ingredient given its id and the quantity to be subtracted.
 * 
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {string} id The id of the ingredient to decrease the inventory of.
 * @body {number} quantity The quantity to be subtracted from the ingredient.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, ingredient_name, quantity, and category fields of the decreased ingredient.
 * @throws {Error} If the item ID or quantity is not provided, or if the item ID or quantity is invalid.
 */
export async function decreaseInventory(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid ingredient id" });
    }

    const { quantity } = req.body;
    if (quantity == null) {
      return res.status(400).json({ error: "quantity is required" });
    }

    const updated = await ingredientsService.decreaseInventoryById(id, quantity);

    if (!updated) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves the usage count of all ingredients in the given time period.
 * 
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {number} start The start time of the period.
 * @query {number} end The end time of the period.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the ingredient_name and times_used fields of all ingredients used in the given period, sorted in descending order of usage count and then alphabetically by ingredient name.
 * @throws {Error} If the start or end timestamps are not provided.
 */
export async function getIngredientUsage(req, res, next) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Query parameters 'start' and 'end' are required" });
    }

    const usage = await ingredientsService.getIngredientUsage(start, end);
    return res.status(200).json(usage);
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves a sales report for all sales transactions in the given time period.
 * 
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {number} start The start time of the period.
 * @query {number} end The end time of the period.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the sales report.
 * @throws {Error} If the start or end timestamps are not provided.
 */
export async function getSalesReport(req, res, next) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Query parameters 'start' and 'end' are required" });
    }

    if (Number.isNaN(start) || Number.isNaN(end)) {
      return res.status(400).json({ error: "Query parameters 'start' and 'end' must be numbers" });
    }

    if (start > end) {
      return res.status(400).json({ error: "Query parameter 'start' must be less than 'end'" });
    }

    const report = await ingredientsService.getSalesReport(start, end);
    return res.status(200).json(report);
  } catch (err) {
    return next(err);
  }
}