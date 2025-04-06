import { db } from "@/lib/db";

/**
 * Get an account by user ID
 * @param userId - The user ID to lookup
 * @returns The account if found, null otherwise
 */
export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId }
    });

    return account;
  } catch {
    return null;
  }
};
