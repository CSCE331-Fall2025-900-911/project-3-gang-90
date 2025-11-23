# Boba POS Backend

Node/Express backend for the Boba shop kiosk + POS webapp.\
This service exposes a REST-style API over a PostgreSQL database (hosted
in AWS) and is consumed by the frontend kiosk/client.

------------------------------------------------------------------------

## Tech Stack

-   **Runtime**: Node.js (ESM modules)
-   **Framework**: Express
-   **Database**: PostgreSQL (AWS, SSL enabled)
-   **DB Client**: [`postgres`](https://www.npmjs.com/package/postgres)
    (tagged template client)
-   **Linting**: ESLint
-   **Misc**: CORS, middleware for logging, validation, and error
    handling

------------------------------------------------------------------------

## Project Structure

``` txt
backend/
├─ package.json
├─ .eslintrc.cjs / .eslint.config.js
├─ .env (not committed)
└─ src/
   ├─ server.js          # Entry point: starts HTTP server
   ├─ app.js             # Express app (routes, middleware wiring)
   ├─ config/
   │  └─ db.js           # Postgres client configuration (sql)
   ├─ db/
   │  ├─ index.js        # Barrel export for all query modules
   │  └─ queries/
   │     ├─ employees.js
   │     ├─ menu.js
   │     ├─ seasonalMenu.js
   │     ├─ ingredients.js
   │     └─ transactions.js
   ├─ api/
   │  ├─ routes/
   │  │  ├─ employees.js
   │  │  ├─ menu.js
   │  │  ├─ seasonalMenu.js
   │  │  ├─ ingredients.js
   │  │  └─ transactions.js
   │  ├─ controllers/
   │  │  ├─ employees.js
   │  │  ├─ menu.js
   │  │  ├─ seasonalMenu.js
   │  │  ├─ ingredients.js
   │  │  └─ transactions.js
   │  └─ services/
   │     ├─ employees.js
   │     ├─ menu.js
   │     ├─ seasonalMenu.js
   │     ├─ ingredients.js
   │     └─ transactions.js
   ├─ middleware/
   │  ├─ logging.js      # Request logging
   │  ├─ validation.js   # (Optional) shared validators
   │  └─ errorHandler.js # Global error handler
   └─ tests/
      └─ dbTest.js       # Manual DB connectivity check
```

**Flow:**\
`route` → `controller` → `service` → `db/queries` → Postgres

-   **Routes**: Define the HTTP paths and methods.
-   **Controllers**: Parse `req`/`res`, handle validation, set status
    codes.
-   **Services**: Business logic + validation, orchestrate queries.
-   **Queries**: Raw SQL via `sql\`...\`\` (no business logic).

------------------------------------------------------------------------

## Setup

### 1. Prerequisites

-   Node.js (v18+ recommended; project currently using a recent Node
    20+/25)
-   npm
-   Access to the AWS Postgres database (you should have a connection
    URL)

### 2. Install dependencies

From the `backend/` directory:

``` bash
cd backend
npm install
```

------------------------------------------------------------------------

## Environment Variables

Create a `.env` in `backend/`. Ask our team for more specifics!

------------------------------------------------------------------------

## Running the Server

### Development


``` bash
npm run dev
```

### Production / plain Node

``` bash
npm start
# or
node src/server.js
```

The server will listen on `PORT` (default `3000`).

------------------------------------------------------------------------

## DB Connectivity Check

There is a simple manual script to verify DB connectivity and SSL:

`src/tests/dbTest.js`:

``` js
import { sql } from "../config/db.js";

async function testSSL() {
  try {
    const [row] = await sql`SHOW ssl;`;
    console.log("ssl:", row);
  } catch (err) {
    console.error(err);
  } finally {
    sql.end();
  }
}

testSSL();
```

Run it with:

``` bash
node src/tests/dbTest.js
```

If configured correctly, it should print info about the `ssl` setting
and exit without errors.

------------------------------------------------------------------------

## API Overview (High Level)

### Employees

-   `GET /api/employees`
-   `GET /api/employees/:id`
-   `POST /api/employees`
-   `PATCH /api/employees/:id`
-   `DELETE /api/employees/:id`
-   Other helpers (e.g., managers, count, soft-delete) as defined in
    controllers/services.

### Menu

-   `GET /api/menu`
-   `GET /api/menu/active`
-   `GET /api/menu/item-id?name=...`
-   `GET /api/menu/:id/ingredients[?seasonal=true|false]`
-   `POST /api/menu`
-   `POST /api/menu/:id/ingredients`
-   `DELETE /api/menu/:id/ingredients/:ingredientId[?seasonal=true|false]`
-   `PATCH /api/menu/:id/price`
-   `DELETE /api/menu/:id`
-   `POST /api/menu/:id/retire`

### Seasonal Menu

-   `GET /api/seasonal-menu`
-   `POST /api/seasonal-menu`
-   `PATCH /api/seasonal-menu/:id/price`
-   `DELETE /api/seasonal-menu/:id`

### Ingredients

-   `GET /api/ingredients`
-   `GET /api/ingredients/id?name=...`
-   `POST /api/ingredients`
-   `PATCH /api/ingredients/:id`
-   `DELETE /api/ingredients/:id`
-   `POST /api/ingredients/refill`
-   `POST /api/ingredients/:id/decrease`
-   `GET /api/ingredients/usage?start=...&end=...`
-   `GET /api/ingredients/sales-report?start=...&end=...`

### Transactions

-   `GET /api/transactions?page=&pageSize=`
-   `GET /api/transactions/count`
-   `GET /api/transactions/by-time?time=...`
-   `GET /api/transactions/:id`
-   `POST /api/transactions`\
    Body includes
    `{ customerName, transactionTime, employeeId, totalPrice, items: [{ id }, ...] }`

> For exact payloads / shapes, see the relevant controllers and services
> under `src/api/`.

------------------------------------------------------------------------

## Error Handling

-   All controllers use the pattern `async (req, res, next)` and call
    `next(err)` for unhandled errors.
-   A global `errorHandler` middleware in
    `src/middleware/errorHandler.js` is mounted at the end of the
    middleware chain and is responsible for sending consistent JSON
    error responses.

Typical pattern:

``` js
app.use(errorHandler);
```

Validation errors at the controller/service layer usually respond with:

-   `400 Bad Request` -- missing/invalid inputs
-   `404 Not Found` -- resource doesn't exist
-   `500 Internal Server Error` -- unexpected server/db errors (via
    global handler)

------------------------------------------------------------------------

## Linting

ESLint is configured for this project.

Run:

``` bash
npm run lint
```

(Assumes a script like `"lint": "eslint . --ext .js"`.)

------------------------------------------------------------------------

## Testing (Future Work)

-   The project is structured to support:
    -   DB tests (e.g. `SHOW ssl`, basic query checks)
    -   Unit tests for services
    -   Integration tests for routes using `supertest`

Once tests are added, they will likely live under `src/tests/` and be
run via:

``` bash
npm test
```

For now, `src/tests/dbTest.js` can be used for manual DB verification.
