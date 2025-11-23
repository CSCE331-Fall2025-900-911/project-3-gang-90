import * as seasonalMenuService from "../services/seasonalMenu.js";

/**
 * Retrieves all seasonal menu items from the database.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the seasonal menu items.
 * @throws {Error} If an unexpected error occurs while retrieving the seasonal menu items.
 */
export async function getSeasonalMenu(req, res, next) {
  try {
    const menu = await seasonalMenuService.getSeasonalMenu();
    return res.status(200).json(menu);
  } catch (err) {
    return next(err);
  }
}

/**
 * Creates a new seasonal menu item in the database.
 *
 * @param {Object} req.body - The data to create the seasonal menu item with. name, price, and popularity are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the item_id, name, popularity, and price fields of the created seasonal menu item.
 * @throws {Error} If the name or price of the menu item is not provided.
 */
export async function createSeasonalMenuItem(req, res, next) {
  try {
    const { name, price, popularity } = req.body;

    const item = await seasonalMenuService.createSeasonalMenuItem({
      name,
      price,
      popularity,
    });

    return res.status(201).json(item);
  } catch (err) {
    if (err.message === "name and price are required to create a seasonal menu item") {
      return res.status(400).json({ error: err.message });
    }

    return next(err);
  }
}

/**
 * Updates the price of a seasonal menu item.
 *
 * @param {Object} req.body - The data to update the price with. price is required.
 * @param {number} req.params.id - The item_id of the seasonal menu item to update the price for.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} If the item ID or price is not provided, or if the item ID or price is invalid.
 */
export async function updateSeasonalMenuPrice(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const { price } = req.body;
    if (price == null) {
      return res.status(400).json({ error: "price is required" });
    }

    const updated = await seasonalMenuService.updateSeasonalMenuPriceById(id, price);

    if (!updated) {
      return res.status(404).json({ error: "Seasonal item not found" });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

/**
 * Deletes a seasonal menu item from the database.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @param {number} req.params.id The item_id of the seasonal menu item to delete.
 *
 * @returns {Promise<void>} A promise that resolves when the delete is complete.
 * @throws {Error} If the item ID is not provided, or if the item ID is invalid.
 */
export async function deleteSeasonalMenuItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    const result = await seasonalMenuService.deleteSeasonalMenuItem(id);

    if (!result) {
      return res.status(404).json({ error: "Seasonal item not found" });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}