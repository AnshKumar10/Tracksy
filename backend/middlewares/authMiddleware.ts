import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Users } from "../models/Users";

/**
 * Middleware to protect routes by verifying the JWT token in the request header.
 * The token is expected to be in the Authorization header as "Bearer <token>".
 * If the token is valid, the user information will be added to the request object.
 *
 * @param request - The HTTP request object
 * @param response - The HTTP response object
 * @param next - The next middleware function to call
 */
export const protect = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let token = request.headers.authorization;

    // Check if the token exists and starts with "Bearer"
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extract token from "Bearer <token>"

      // Verify the token using JWT secret and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (typeof decoded !== "object" || !decoded?.id) {
        response.status(401).json({ error: "Access denied" });
      }

      // Fetch user from database based on the decoded ID and exclude password field
      request.user = await Users.findById(decoded?.id).select("-password");

      if (!request.user) {
        response.status(401).json({
          message: "User not found",
        });
      }

      next();
    } else {
      response.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      response.status(401).json({
        message: "Token failed",
        error: error.message,
      });
    } else {
      response.status(401).json({
        message: "Token failed",
        error: "Unknown error",
      });
    }
  }
};

/**
 * Middleware to allow access only to users with the 'admin' role.
 * If the user is an admin, the request proceeds; otherwise, a 403 error is sent.
 *
 * @param request - The HTTP request object
 * @param response - The HTTP response object
 * @param next - The next middleware function to call
 */
export const adminOnlyAccess = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  if (request.user && request?.user.role === "admin") {
    // If the user is an admin, proceed
    next();
  } else {
    // Otherwise, respond with a 403 error
    response.status(403).json({
      message: "Access denied, admin only",
    });
  }
};
