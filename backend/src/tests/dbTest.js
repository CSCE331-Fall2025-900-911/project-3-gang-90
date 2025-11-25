import test from "node:test"
import assert from "node:assert"
import { sql } from "../config/db.js"


test("Checking database connection", async () => {
    const res = await sql`SELECT 1;`;
    assert.strictEqual(res[0], 1);
});

test("Checking existence of table: ingredients", async () => {
    // TODO: Implement later
});

test("Checking existence of table: ingredients_map", async () => {
    // TODO: Implement later
});

test("Checking existence of table: menu", async () => {
    // TODO: Implement later
});

test("Checking existence of table: personnel", async () => {
    // TODO: Implement later
});

test("Checking existence of table: seasonal_menu", async () => {
    // TODO: Implement later
});

test("Checking existence of table: transaction_details", async () => {
    // TODO: Implement later
});

test("Checking existence of table: transactions", async () => {
    // TODO: Implement later
});