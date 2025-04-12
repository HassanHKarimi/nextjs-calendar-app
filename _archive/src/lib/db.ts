import { PrismaClient } from "@prisma/client";
import { neonConfig } from "./neon";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Pass the Neon configuration to Prisma
    // This is only required when deployed to Vercel
    datasources: process.env.VERCEL
      ? {
          db: {
            url: neonConfig.connectionString,
          },
        }
      : undefined,
  });
};

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
