import postgres from "postgres";
import { DATABASE_URL } from "./index.js";

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined!");
}


export const sql = postgres(DATABASE_URL, {
    ssl: "require",
    max: 10
});