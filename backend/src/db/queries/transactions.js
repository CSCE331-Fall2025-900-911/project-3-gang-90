import { sql } from "../../config/db.js";

/**
 * Maps a SQL row object to a transaction object.
 *
 * @param {Object} row The SQL row object to map.
 * @returns {Object} A transaction object with the fields id, customerName, transactionTime, employeeId, and totalPrice.
 */
function mapTransactionRow(row) {
  return {
    id: row.transaction_id,
    customerName: row.customer_name,
    transactionTime: row.transaction_time,
    employeeId: row.employee_id,
    totalPrice: row.total_price,
  };
}

/**
 * Retrieves a list of transactions from the database, with the given offset and limit.
 *
 * @param {number} [offset=0] The offset from which to start retrieving transactions.
 * @param {number} [limit=50] The maximum number of transactions to retrieve.
 * @throws {Error} If the offset is negative or the limit is not greater than zero.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transactions.
 */
export async function getTransactions(offset = 0, limit = 50) {
  if (offset < 0) {
    throw new Error("Offset cannot be negative.");
  }
  if (limit <= 0) {
    throw new Error("Limit must be greater than zero.");
  }

  const rows = await sql`
    SELECT transaction_id, customer_name, transaction_time, employee_id, total_price
    FROM transactions
    ORDER BY transaction_time DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  return rows.map(mapTransactionRow);
}

/**
 * Retrieves a page of transactions from the database, with the given page number and page size.
 *
 * @param {number} [page=0] The page number to retrieve.
 * @param {number} [pageSize=50] The maximum number of transactions to retrieve per page.
 * @throws {Error} If the page is negative or the page size is not greater than zero.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transactions.
 */
export async function getTransactionsPage(page = 0, pageSize = 50) {
  if (page < 0 || pageSize <= 0) {
    throw new Error("Page must be >= 0 and pageSize > 0");
  }

  const offset = page * pageSize;
  return await getTransactions(offset, pageSize);
}

/**
 * Retrieves the count of all transactions in the database.
 *
 * @returns {Promise<number>} A promise that resolves to the count of all transactions.
 */
export async function countTransactions() {
  const rows = await sql`
    SELECT COUNT(*) AS cnt
    FROM transactions;
  `;

  if (rows.length === 0) {
    return 0;
  }

  // cnt may come back as a string depending on the driver
  return Number(rows[0].cnt) || 0;
}

/**
 * Retrieves a transaction by its ID from the database.
 *
 * @param {number} transactionId The ID of the transaction to retrieve.
 * @throws {Error} If the transaction ID is negative or null.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transaction, or null if no transaction with that ID exists.
 */
export async function getTransactionById(transactionId) {
  if (transactionId == null || transactionId < 0) {
    throw new Error("Transaction ID cannot be negative or null.");
  }

  const rows = await sql`
    SELECT transaction_id, customer_name, transaction_time, employee_id, total_price
    FROM transactions
    WHERE transaction_id = ${transactionId};
  `;

  if (rows.length === 0) {
    return null; // caller can turn this into 404
  }

  return mapTransactionRow(rows[0]);
}

/**
 * Retrieves all transactions from the database at a given time.
 *
 * @param {number} time The time at which to retrieve transactions.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the fields id, customerName, transactionTime, employeeId, and totalPrice of the retrieved transactions, sorted in descending order of transaction time and then in ascending order of transaction ID.
 */
export async function getTransactionsByTime(time) {
  const rows = await sql`
    SELECT transaction_id, customer_name, transaction_time, employee_id, total_price
    FROM transactions
    WHERE transaction_time = ${time}
    ORDER BY transaction_time DESC, transaction_id ASC;
  `;

  // If none, just return an empty array (service/controller can decide what to do)
  return rows.map(mapTransactionRow);
}

/**
 * Inserts a transaction into the database and returns the newly created transaction.
 *
 * @param {{customerName: string, transactionTime: number, employeeId: number, totalPrice: number}} transaction
 *   The transaction to insert.
 * @param {sqlClient} sqlClient
 *   The SQL client to use for the query.
 * @throws {Error} If creating the transaction failed.
 * @returns {Promise<Object>} A promise that resolves to the newly created transaction.
 */
async function insertTransaction({
  customerName,
  transactionTime,
  employeeId,
  totalPrice,
}, sqlClient) {
  const rows = await sqlClient`
    INSERT INTO transactions (customer_name, transaction_time, employee_id, total_price)
    VALUES (${customerName}, ${transactionTime}, ${employeeId}, ${totalPrice})
    RETURNING transaction_id, customer_name, transaction_time, employee_id, total_price;
  `;

  if (rows.length === 0) {
    throw new Error("Creating transaction failed: no row returned.");
  }

  return mapTransactionRow(rows[0]);
}

/**
 * Adds a transaction and its details to the database.
 *
 * @param {{customerName: string, transactionTime: number, employeeId: number, totalPrice: number}} transaction
 *   The transaction data to add.
 * @param {Array<{id: number}>} items
 *   The items to add to the transaction.
 * @throws {Error} If either the transaction or items are invalid.
 * @returns {Promise<Object>} A promise that resolves to the newly created transaction.
 */
export async function addTransactionAndDetails(transaction, items) {
  if (!transaction) {
    throw new Error("Transaction data is required.");
  }

  if (!Array.isArray(items)) {
    throw new Error("Items must be an array.");
  }

  return await sql.begin(async (sqlTx) => {
    const created = await insertTransaction(transaction, sqlTx);

    // If there are no items, we still commit the transaction record
    if (items.length > 0) {
      for (const item of items) {
        if (!item || item.id == null) {
          throw new Error("Each item must have an id when adding transaction details.");
        }

        await sqlTx`
          INSERT INTO transaction_details (transaction_id, item_id)
          VALUES (${created.id}, ${item.id});
        `;
      }
    }

    return created;
  });
}