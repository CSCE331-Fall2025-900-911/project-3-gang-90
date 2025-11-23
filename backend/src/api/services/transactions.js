import { transactions as transactionQueries } from "../../db/index.js";


/**
 * Retrieves a list of transactions from the database, with the given offset and limit.
 *
 * @param {{page: number, pageSize: number}} options
 *   The options to use when retrieving transactions.
 *   The page number to retrieve.
 *   The maximum number of transactions to retrieve.
 * @throws {Error} If the page is negative or the page size is not greater than zero.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transactions, sorted in descending order of transaction time and then in ascending order of transaction ID.
 */
export async function listTransactions({ page = 0, pageSize = 50 } = {}) {
  if (page < 0 || pageSize <= 0) {
    throw new Error("page must be >= 0 and pageSize must be > 0");
  }

  return await transactionQueries.getTransactionsPage(page, pageSize);
}

/**
 * Retrieves a list of transactions from the database, with the given offset and limit.
 *
 * @param {{offset: number, limit: number}} options
 *   The options to use when retrieving transactions.
 *   The offset from which to start retrieving transactions.
 *   The maximum number of transactions to retrieve.
 * @throws {Error} If the offset is negative or the limit is not greater than zero.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transactions.
 */
export async function listTransactionsWithOffset({ offset = 0, limit = 50 } = {}) {
  if (offset < 0 || limit <= 0) {
    throw new Error("offset must be >= 0 and limit must be > 0");
  }

  return await transactionQueries.getTransactions(offset, limit);
}

/**
 * Retrieves the count of all transactions in the database.
 *
 * @returns {Promise<number>} A promise that resolves to the count of all transactions.
 */
export async function countTransactions() {
  return await transactionQueries.countTransactions();
}

/**
 * Retrieves a transaction by its ID from the database.
 *
 * @param {number} id The ID of the transaction to retrieve.
 * @throws {Error} If the transaction ID is negative or null.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transaction, or null if no transaction with that ID exists.
 */
export async function getTransactionById(id) {
  if (id == null) {
    throw new Error("Transaction id is required");
  }

  return await transactionQueries.getTransactionById(id);
}

/**
 * Retrieves all transactions from the database at a given time.
 *
 * @param {number} time The time at which to retrieve transactions.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transactions, sorted in descending order of transaction time and then in ascending order of transaction ID.
 * @throws {Error} If the time is not provided.
 */
export async function getTransactionsByTime(time) {
  if (!time) {
    throw new Error("time is required to fetch transactions by time");
  }

  return await transactionQueries.getTransactionsByTime(time);
}

/**
 * Creates a new transaction in the database with the given customerName, transactionTime, employeeId, and totalPrice, and adds the given items to the transaction.
 *
 * @param {{customerName: string, transactionTime: number, employeeId: number, totalPrice: number, items: Array<{itemId: number }>>}} data
 *   The data to create the transaction with. customerName, transactionTime, employeeId, and totalPrice are required.
 *   items is required and must be an array of objects with itemId.
 * @returns {Promise<Object>} A promise that resolves to an object containing the transaction_id of the created transaction.
 * @throws {Error} If any of the required fields are not provided, or if items is not an array of objects with itemId.
 */
export async function createTransactionWithItems({
  customerName,
  transactionTime,
  employeeId,
  totalPrice,
  items,
}) {
  if (!customerName) {
    throw new Error("customerName is required to create a transaction");
  }

  if (!transactionTime) {
    throw new Error("transactionTime is required to create a transaction");
  }

  if (employeeId == null) {
    throw new Error("employeeId is required to create a transaction");
  }

  if (totalPrice == null) {
    throw new Error("totalPrice is required to create a transaction");
  }

  if (!Array.isArray(items)) {
    throw new Error("items must be an array when creating a transaction");
  }

  return await transactionQueries.addTransactionAndDetails(
    {
      customerName,
      transactionTime,
      employeeId,
      totalPrice,
    },
    items,
  );
}