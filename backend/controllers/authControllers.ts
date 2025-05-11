import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Users } from "../models/Users";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { UserRoles } from "../types/users";

/**
 * Generate a JWT token for a given user ID.
 * @param userId - MongoDB ObjectId or string representing the user
 * @returns JWT token as string
 */
const generateToken = (userId: string | Types.ObjectId): string => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
export const registerUser = async (request: Request, response: Response) => {
  try {
    const user = request.body;
    const isUserExists = await Users.findOne({ email: user?.email });

    if (isUserExists) {
      response.status(400).json({ message: "User already exists" });
    }

    const role =
      user?.adminInviteToken === process.env.ADMIN_INVITE_TOKEN
        ? UserRoles.ADMIN
        : UserRoles.MEMBER;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user?.password, salt);

    const createdUser = await Users.create({
      name: user?.name,
      email: user?.email,
      password: hashedPassword,
      profilePic: user?.profilePic,
      role: role,
    });

    response.status(201).json({
      _id: createdUser?._id,
      name: createdUser?.name,
      email: createdUser?.email,
      profilePic: createdUser?.profilePic,
      role: createdUser?.role,
      token: generateToken(createdUser?._id),
    });
  } catch (error) {
    const err = error as Error;
    response.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
export const loginUser = async (request: Request, response: Response) => {
  try {
    const email = request.body?.email;
    const password = request.body?.password;
    const user = await Users.findOne({ email: email });

    if (!user) {
      response.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user?.password || "");

    if (!isMatch) {
      response.status(401).json({ message: "Invalid Email or Password" });
    }

    response.json({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      profilePic: user?.profilePic,
      role: user?.role,
      token: generateToken(user?._id as Types.ObjectId),
    });
  } catch (error) {
    const err = error as Error;
    response.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
export const getUserProfile = async (request: Request, response: Response) => {
  try {
    const userId = request?.user?.id;
    const user = await Users.findById(userId)?.select("-password");

    if (!user) {
      response.status(401).json({ message: "User not found" });
    }

    response.json(user);
  } catch (error) {
    const err = error as Error;
    response.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
export const updateUserProfile = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request?.user?.id;
    const user = await Users.findById(userId);

    if (!user) {
      response.status(401).json({ message: "User not found" });
      return;
    }

    const name = request.body?.name;
    const email = request.body?.email;
    const password = request.body?.password;

    user.name = name || user?.name;
    user.email = email || user?.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    response.json({
      _id: updatedUser?._id,
      name: updatedUser?.name,
      email: updatedUser?.email,
      profilePic: updatedUser?.profilePic,
      role: updatedUser?.role,
      token: generateToken(updatedUser?._id),
    });
  } catch (error) {
    const err = error as Error;
    response.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
