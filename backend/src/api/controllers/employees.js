import * as employeeService from "../services/employees.js";

/**
 * Returns all active employees in the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the employee_id, name, role, pay, and is_active fields of all active employees.
 * @throws {Error} If an unexpected error occurs while retrieving the employees.
 */
export async function getAllEmployees(req, res, next) {
    try {
        const employees = await employeeService.getAllEmployees();
        return res.status(200).json(employees);
    } catch (err) {
        return next(err);
    }
}

/**
 * Returns all active managers in the database.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects containing the employee_id, name, role, pay, and is_active fields of all active managers.
 * @throws {Error} If an unexpected error occurs while retrieving the managers.
 */
export async function getManagers(req, res, next) {
    try {
        const managers = await employeeService.getManagers();
        return res.status(200).json(managers);
    } catch (err) {
        return next(err);
    }
}

/**
 * Creates a new employee in the database.
 *
 * @param {Object} req.body - The data to create the employee with. name, role, and pay are required.
 * @returns {Promise<Object>} A promise that resolves to an object containing the employee_id of the created employee.
 * @throws {Error} If the required fields are not provided, or an unexpected error occurs while creating the employee.
 */
export async function createEmployee(req, res, next) {
    try {
        const employee = await employeeService.createEmployee(req.body);
        return res.status(201).json(employee);
    } catch (err) {
        if (err.message === "Missing required fields: name, role, and pay are required.") {
            console.error("Error in createEmployee: ", err);
            return res.status(400).json({ error: err.message });
        }
        return next(err);
    }
}

/**
 * Updates an existing employee in the database.
 *
 * @param {Object} req.body - The data to update the employee with. name, role, and pay are optional.
 * @returns {Promise<Object>} A promise that resolves to an object containing the employee_id of the updated employee.
 * @throws {Error} If the id is not provided, or an unexpected error occurs while updating the employee.
 */
export async function updateEmployee(req, res, next) {
    try {
        // Validate employee id
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid employee id" });
        }

        const employee = await employeeService.updateEmployeeById(id, req.body);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        return res.status(200).json(employee);
    } catch (err) {
        return next(err);
    }
}

/**
 * Deletes an employee from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A promise that resolves to an object containing the employee_id of the deleted employee.
 * @throws {Error} If the id is not provided, or an unexpected error occurs while deleting the employee.
 */
export async function deleteEmployee(req, res, next) {
    try {
        // Validate employee id
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid employee id" });
        }

        const employee = await employeeService.deleteEmployeeById(id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        return res.status(200).json(employee);
    } catch (err) {
        return next(err);
    }
}

/**
 * Returns the count of all active employees in the database.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the count of all active employees.
 * @throws {Error} If an unexpected error occurs while retrieving the count.
 */
export async function countActiveEmployees(req, res, next) {
    try {
        const count = await employeeService.countActiveEmployees();
        return res.status(200).json({ count: count });
    } catch (err) {
        return next(err);
    }
}