import { sql } from "../../config/db.js";

// Functions that do not modify the database

/**
 * Returns all active managers in the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the employee_id, name, role, pay, and is_active fields of all active managers.
 */
export async function getManagers() {
    const rows = await sql`
    SELECT employee_id, name, role, pay, is_active
    FROM personnel 
    WHERE role = 'manager' AND is_active = TRUE;
    `;
    return rows.map((row) => ({
        employee_id: row.employee_id,
        name: row.name,
        role: row.role,
        pay: row.pay,
        is_active: row.is_active,
    }));
}

/**
 * Returns all active employees in the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the employee_id, name, role, pay, and is_active fields of all active employees.
 */
export async function getEmployees() {
    const rows = await sql`
    SELECT employee_id, name, role, pay, is_active
    FROM personnel 
    WHERE is_active = TRUE;
    `;
    return rows.map((row) => ({
        employee_id: row.employee_id,
        name: row.name,
        role: row.role,
        pay: row.pay,
        is_active: row.is_active,
    }));
}

/**
 * Returns the count of all active employees in the database.
 *
 * @returns {Promise<number>} A promise that resolves to the count of all active employees.
 */
export async function countEmployees() {
    const rows = await sql`
    SELECT COUNT(*)::int as count
    FROM personnel 
    WHERE is_active = TRUE;
    `;
    return rows[0].count;
}

// Functions that modify the database

/**
 * Adds a new employee to the database.
 *
 * @param {string} name The name of the new employee.
 * @param {string} role The role of the new employee.
 * @param {number} pay The pay of the new employee.
 * @param {boolean} [state=true] Whether the new employee is active or not.
 * @returns {Promise<Object>} A promise that resolves to an object containing the employee_id, name, role, pay, and is_active fields of the new employee.
 */
export async function addEmployee(name, role, pay, state = true) {
    const rows = await sql`
    INSERT INTO personnel (name, role, pay, is_active)
    VALUES (${name}, ${role}, ${pay}, ${state})
    RETURNING employee_id, name, role, pay, is_active;
    `;

    return {
        employee_id: rows[0].employee_id,
        name: rows[0].name,
        role: rows[0].role,
        pay: rows[0].pay,
        is_active: rows[0].is_active,
    };
}

/**
 * Updates an employee in the database.
 *
 * @param {number} id The id of the employee to update.
 * @param {string} [name] The new name of the employee.
 * @param {string} [role] The new role of the employee.
 * @param {number} [pay] The new pay of the employee.
 * @param {boolean} [state=true] Whether the employee is active or not.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the employee_id, name, role, pay, and is_active fields of the updated employee, or null if no employee with that id exists.
 * @throws {Error} If the id is not provided.
 */
export async function updateEmployee(id, name, role, pay, state) {
    if (id == null) { throw new Error("Missing employee id!"); }

    const rows = await sql`
    UPDATE personnel
    SET
        name = COALESCE(${name}, name),
        role = COALESCE(${role}, role),
        pay = COALESCE(${pay}, pay),
        is_active = COALESCE(${state}, is_active)
    WHERE employee_id = ${id}
    RETURNING employee_id, name, role, pay, is_active;
    `;

    if (rows.length === 0) { return null; }

    return {
        employee_id: rows[0].employee_id,
        name: rows[0].name,
        role: rows[0].role,
        pay: rows[0].pay,
        is_active: rows[0].is_active,
    };
}

/**
 * Deletes an employee from the database.
 *
 * @param {number} id The id of the employee to delete.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the employee_id of the deleted employee, or null if no employee with that id exists.
 */
export async function deleteEmployee(id) {
    if (id == null) { throw new Error("Missing employee id!"); }
    const res = await sql`
    DELETE FROM personnel
    WHERE employee_id = ${id}
    RETURNING employee_id;
    `;
    if (res.length === 0) { return null; }
    return { employee_id: res[0].employee_id };
}