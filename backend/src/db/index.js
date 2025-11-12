import pg from 'pg';
import { config } from '../config/index.js';

const client = new pg.Client({
  connectionString: config.databaseUrl,
});
await client.connect();

export default client;