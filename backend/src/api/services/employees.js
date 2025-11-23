import { employees as employeeQueries } from "../../db/index.js";

/**
 * Service layer for employee-related operations.
 *
 * This layer sits between controllers (HTTP) and the DB queries.
 * It can enforce business rules, input validation, and compose
 * multiple query calls when needed.
 */


/**
 * Returns all active employees in the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the employee_id, name, role, pay, and is_active fields of all active employees.
 */
export async function getAllEmployees() {
  // Returns all active employees
  return await employeeQueries.getEmployees();
}

/**
 * Returns all active managers in the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the employee_id, name, role, pay, and is_active fields of all active managers.
 */
export async function getManagers() {
  // Returns all active managers
  return await employeeQueries.getManagers();
}

/**
 * Creates a new employee in the database.
 *
 * @param {{name: string, role: string, pay: number, state: boolean}} data
 *   The data to create the employee with. name, role, and pay are required.
 *   state defaults to true if not provided.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the employee_id of the created employee, or null if no employee with that id exists.
 * @throws {Error} If the required fields are not provided.
 */
export async function createEmployee({ name, role, pay, state = true }) {
  if (!name || !role || pay == null) {
    throw new Error("Missing required fields: name, role, and pay are required.");
  }

  return await employeeQueries.addEmployee(name, role, pay, state);
}


/**
 * Updates an existing employee in the database.
 *
 * @param {number} id The id of the employee to update.
 * @param {{name: string, role: string, pay: number, state: boolean}} [data] Optional data to update the employee with.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the employee_id of the updated employee, or null if no employee with that id exists.
 * @throws {Error} If the id is not provided.
 */
export async function updateEmployeeById(id, { name, role, pay, state } = {}) {
  if (!id) {
    throw new Error("Employee id is required for update.");
  }

  const updated = await employeeQueries.updateEmployee(id, name, role, pay, state);
  return updated;
}


/**
 * Deletes an employee from the database by id.
 *
 * @param {number} id The id of the employee to delete.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the employee_id of the deleted employee, or null if no employee with that id exists.
 * @throws {Error} If the id is not provided.
 */
export async function deleteEmployeeById(id) {
  if (!id) {
    throw new Error("Employee id is required for delete.");
  }

  return await employeeQueries.deleteEmployee(id);
}

/**
 * Returns the count of all active employees in the database.
 *
 * @returns {Promise<number>} A promise that resolves to the count of all active employees.
 */
export async function countActiveEmployees() {
  return await employeeQueries.countEmployees();
}