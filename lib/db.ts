// lib/db.ts
import { PrismaClient } from "@prisma/client";

// Create a global prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Use global instance to prevent multiple instances during hot reloading
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
