import { Pool } from 'pg';

// Create a connection pool that will be configured via environment variables
// The pg library automatically uses these environment variables:
// - PGHOST: The database host
// - PGUSER: The database user
// - PGPASSWORD: The database password
// - PGDATABASE: The database name
// - PGPORT: The database port (defaults to 5432)
// - DATABASE_URL: A connection string that can be used instead of individual variables

// Create a pool with SSL enabled (required for most cloud PostgreSQL providers)
const pool = new Pool({
  // The pool will use environment variables automatically
  // You can also explicitly configure it here if needed
  // connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Helper function to execute queries
export async function executeQuery(query: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Helper function to execute a single query and return the first row
export async function querySingle(query: string, params: any[] = []) {
  const rows = await executeQuery(query, params);
  return rows[0];
}

// Helper function to execute a transaction
export async function executeTransaction(callback: (client: any) => Promise<any>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
