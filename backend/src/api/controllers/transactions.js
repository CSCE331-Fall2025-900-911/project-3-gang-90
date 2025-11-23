import * as transactionsService from "../services/transactions.js";


/**
 * Retrieves a list of transactions from the database, with the given page number and page size.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {number} page The page number to retrieve.
 * @query {number} pageSize The maximum number of transactions to retrieve per page.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the retrieved transactions.
 * @throws {Error} If the page or page size is not a valid number.
 */
export async function listTransactions(req, res, next) {
  try {
    let { page, pageSize } = req.query;

    // use defaults if not provided
    page = page === undefined ? 0 : Number(page);
    pageSize = pageSize === undefined ? 50 : Number(pageSize);

    if (Number.isNaN(page) || Number.isNaN(pageSize)) {
      return res
        .status(400)
        .json({ error: "page and pageSize must be valid numbers" });
    }

    const transactions = await transactionsService.listTransactions({
      page,
      pageSize,
    });

    return res.status(200).json(transactions);
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves the count of all transactions in the database.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the count of all transactions.
 * @throws {Error} If an unexpected error occurs while retrieving the transaction count.
 */
export async function countTransactions(req, res, next) {
  try {
    const count = await transactionsService.countTransactions();
    return res.status(200).json({ count });
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves a transaction by its ID from the database.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {number} id The ID of the transaction to retrieve.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transaction, or null if no transaction with that ID exists.
 * @throws {Error} If the transaction ID is invalid, or if an unexpected error occurs while retrieving the transaction.
 */
export async function getTransactionById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid transaction id" });
    }

    const tx = await transactionsService.getTransactionById(id);

    if (!tx) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json(tx);
  } catch (err) {
    return next(err);
  }
}

/**
 * Retrieves all transactions from the database at a given time.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @query {number} time The time at which to retrieve transactions.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transactions, sorted in descending order of transaction time and then in ascending order of transaction ID.
 * @throws {Error} If the time is not provided.
 */
export async function getTransactionsByTime(req, res, next) {
  try {
    const { time } = req.query;

    if (!time) {
      return res
        .status(400)
        .json({ error: "Query parameter 'time' is required" });
    }

    const transactions = await transactionsService.getTransactionsByTime(time);
    return res.status(200).json(transactions);
  } catch (err) {
    return next(err);
  }
}

/**
 * Creates a new transaction in the database with the given customerName, transactionTime, employeeId, and totalPrice, and adds the given items to the transaction.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {function} next The next function to call in the middleware chain.
 *
 * @body {Object} req.body - The data to create the transaction with. customerName, transactionTime, employeeId, totalPrice, and items are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the transaction_id of the created transaction.
 * @throws {Error} If any of the required fields are not provided, or if items is not an array of objects with itemId.
 */
export async function createTransactionWithItems(req, res, next) {
  try {
    const { customerName, transactionTime, employeeId, totalPrice, items } =
      req.body;

    if (!customerName) {
      return res
        .status(400)
        .json({ error: "customerName is required to create a transaction" });
    }

    if (!transactionTime) {
      return res
        .status(400)
        .json({ error: "transactionTime is required to create a transaction" });
    }

    if (employeeId == null) {
      return res
        .status(400)
        .json({ error: "employeeId is required to create a transaction" });
    }

    if (totalPrice == null) {
      return res
        .status(400)
        .json({ error: "totalPrice is required to create a transaction" });
    }

    if (!Array.isArray(items)) {
      return res
        .status(400)
        .json({ error: "items must be an array when creating a transaction" });
    }

    for (const item of items) {
      if (!item || item.id == null) {
        return res.status(400).json({
          error: "Each item must be an object with an 'id' field",
        });
      }
    }

    const created = await transactionsService.createTransactionWithItems({
      customerName,
      transactionTime,
      employeeId,
      totalPrice,
      items,
    });

    // created is the full transaction object from the DB
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}
