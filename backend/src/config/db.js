import postgres from "postgres";
import { DATABASE_URL } from "./index.js";

export const sql = postgres(DATABASE_URL);