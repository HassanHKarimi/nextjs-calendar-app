/**
 * This file configures the Neon database connection for Prisma
 * to work with Vercel deployments.
 */

import { Pool } from '@neondatabase/serverless';

// Add this to support WebSocket connections in environments that might not have native support
let connectionString = process.env.DATABASE_URL || '';

// For security, you can uncomment the following code if needed
// if (connectionString.includes('sslmode=require')) {
//   connectionString = connectionString.replace('sslmode=require', 'sslmode=verify-full');
// }

const pool = new Pool({ connectionString });

// Used by Prisma
export const neonConfig = {
  connectionString,
  pool,
};
