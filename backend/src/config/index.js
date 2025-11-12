const required = ['DATABASE_URL', 'CLIENT'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
}

export const config = {
  port: process.env.PORT || 3000,
  clientOrigin: process.env.CLIENT,
  databaseUrl: process.env.DATABASE_URL,
  // future: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_CALLBACK_URL
};