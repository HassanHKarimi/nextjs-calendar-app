/**
 * Neon database configuration for Prisma
 * This file sets up the Neon serverless driver for use with Prisma in serverless environments like Vercel
 */

import { Pool } from '@neondatabase/serverless';

// Get the connection string from the environment variable
const connectionString = process.env.DATABASE_URL || '';

// Create a connection pool using the Neon serverless driver
export const pool = new Pool({ connectionString });

// Ensure connections are properly closed when the application terminates
if (typeof window === 'undefined') {
  // Only add these event listeners on the server side
  process.on('beforeExit', () => {
    void pool.end();
  });
}

// Configuration for Prisma to use with Neon
export const neonConfig = {
  connectionString,
  pool,
};
