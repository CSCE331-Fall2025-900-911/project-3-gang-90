import * as menuService from "../services/menu.js";

/**
 * Retrieves all menu items from the database.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the menu items.
 * @throws {Error} If an unexpected error occurs while retrieving the menu items.
 */
export async function getMenu(req, res, next) {
  try {
    const menu = await menuService.getMenu();
    return res.status(200).json(menu);
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves all active menu items from the database.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the active menu items.
 * @throws {Error} If an unexpected error occurs while retrieving the active menu items.
 */
export async function getActiveMenu(req, res, next) {
  try {
    const menu = await menuService.getActiveMenu();
    return res.status(200).json(menu);
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves the item_id of a menu item given its name.
 *
 * @param {string} name The name of the menu item to retrieve the item_id for.
 * @returns {Promise<Object>} A promise that resolves to an object containing the item_id of the menu item if it exists, or null if no item with the given name exists or if there are multiple items with the same name.
 * @throws {Error} If the item name is not provided.
 */
export async function getItemIdByName(req, res, next) {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Query parameter 'name' is required" });
    }

    const id = await menuService.getItemIdByName(name);

    if (id == null) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({ id });
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves the ingredients of a menu item given its id.
 *
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 * 
 * @query {string} id The item id of the menu item to retrieve the ingredients for.
 * @query {string} [seasonal] Whether to retrieve the seasonal ingredients or not. Defaults to false.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredients of the menu item.
 * @throws {Error} If an unexpected error occurs while retrieving the ingredients.
 */
export async function getItemIngredients(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const { seasonal } = req.query;
    let isSeasonal;
    if (seasonal === "true") isSeasonal = true;
    else if (seasonal === "false") isSeasonal = false;

    const ingredients = await menuService.getItemIngredients(id, isSeasonal);
    return res.status(200).json(ingredients);
  } catch (err) {
    return next(err);
  }
}

/**
 * Creates a new menu item in the database.
 *
 * @param {Object} req.body - The data to create the menu item with. name, price, and popularity are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the item_id, name, price, and popularity fields of the created menu item.
 * @throws {Error} If the required fields are not provided, or an unexpected error occurs while creating the menu item.
 */
export async function createMenuItem(req, res, next) {
  try {
    const { name, price, popularity } = req.body;

    const item = await menuService.createMenuItem({
      name,
      price,
      popularity,
    });

    return res.status(201).json(item);
  } catch (err) {
    if (err.message === "name and price are required to create a menu item") {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  }
}

/**
 * Adds an ingredient to a menu item.
 *
 * @param {Object} req.body - The data to add the ingredient with. ingredientId and isSeasonal are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the ingredient_id, item_id, and is_seasonal fields of the added ingredient.
 * @throws {Error} If the item ID or ingredient ID is not provided, or if the item ID or ingredient ID is invalid.
 */
export async function addIngredientToItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const { ingredientId, isSeasonal } = req.body;

    if (ingredientId == null) {
      return res.status(400).json({ error: "ingredientId is required" });
    }
    const ingredientIdNum = Number(ingredientId);
    if (Number.isNaN(ingredientIdNum)) {
      return res.status(400).json({ error: "Invalid ingredient id" });
    }

    const mapping = await menuService.addIngredientToItem(
      id,
      ingredientId,
      isSeasonal
    );
    return res.status(201).json(mapping);
  } catch (err) {
    return next(err);
  }
}

/**
 * Removes an ingredient from a menu item.
 *
 * @param {Object} req.params - The params to remove the ingredient with. itemId and ingredientId are required.
 * @returns {Promise<void>} A promise that resolves when the remove is complete.
 * @throws {Error} If the item ID or ingredient ID is not provided, or if the item ID or ingredient ID is invalid.
 */
export async function removeIngredientFromItem(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const ingredientId = Number(req.params.ingredientId);

    if (Number.isNaN(itemId) || Number.isNaN(ingredientId)) {
      return res.status(400).json({ error: "Invalid itemId or ingredientId" });
    }

    const item = await menuService.removeIngredientFromItem(
      itemId,
      ingredientId
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

/**
 * Updates the price of a menu item.
 *
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {string} id The item_id of the menu item to update the price for.
 * @body {number} price The new price of the menu item.
 *
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} If the item ID or price is not provided, or if the item ID or price is invalid.
 */
export async function updateMenuPrice(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const { price } = req.body;
    if (price == null) {
      return res.status(400).json({ error: "price is required" });
    }

    const item = await menuService.updateMenuPriceById(id, price);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

/**
 * Deletes a menu item from the database.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {string} id The item_id of the menu item to delete.
 *
 * @returns {Promise<void>} A promise that resolves when the delete is complete.
 * @throws {Error} If the item ID is not provided, or if the item ID is invalid.
 */
export async function deleteMenuItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const item = await menuService.deleteMenuItem(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

/**
 * Retires a menu item from the database.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {string} id The item_id of the menu item to retire.
 *
 * @returns {Promise<void>} A promise that resolves when the retire is complete.
 * @throws {Error} If the item ID is not provided, or if the item ID is invalid.
 */
export async function retireMenuItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const item = await menuService.retireMenuItem(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
