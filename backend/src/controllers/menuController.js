import * as menuService from '../services/menuService.js';

export async function getMenu(req, res, next) {
  try {
    const menu = await menuService.getMenu();
    res.json(menu);
  } catch (err) {
    next(err);
  }
}