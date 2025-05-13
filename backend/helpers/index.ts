import jwt from "jsonwebtoken";
import { Types } from "mongoose";

/**
 * Generate a JWT token for a given user ID.
 * @param userId - MongoDB ObjectId or string representing the user
 * @returns JWT token as string
 */
export const generateToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
