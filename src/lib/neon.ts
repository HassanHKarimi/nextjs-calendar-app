/**
 * Neon database configuration for Prisma
 * This file sets up the Neon serverless driver for use with Prisma in serverless environments like Vercel
 */

import { Pool } from '@neondatabase/serverless';

// Get the connection string from the environment variable
const connectionString = process.env.DATABASE_URL || '';

// Create a connection pool using the Neon serverless driver
export const pool = new Pool({ connectionString });

// Export a simpler neonConfig for compatibility with various environments
export const neonConfig = {
  connectionString,
};
