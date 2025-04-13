// data/user.ts
import { db } from "../lib/db";

// Function to get a user by email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email }
    });
    
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

// Function to get a user by ID
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id }
    });
    
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};
