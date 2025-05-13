import { Request, Response } from "express";
import { Users } from "../models/Users";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { UserRolesEnum } from "../types/users";
import { generateToken } from "../helpers";
import { HttpStatusEnum } from "../types";

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
        ? UserRolesEnum.ADMIN
        : UserRolesEnum.MEMBER;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user?.password, salt);

    const createdUser = await Users.create({
      name: user?.name,
      email: user?.email,
      password: hashedPassword,
      profilePic: user?.profilePic,
      role: role,
    });

    response.status(HttpStatusEnum.CREATED).json({
      _id: createdUser?._id,
      name: createdUser?.name,
      email: createdUser?.email,
      profilePic: createdUser?.profilePic,
      role: createdUser?.role,
      token: generateToken(createdUser?._id),
    });
  } catch (error) {
    const err = error as Error;
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
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
      response
        .status(HttpStatusEnum.UNAUTHORIZED)
        .json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user?.password || "");

    if (!isMatch) {
      response
        .status(HttpStatusEnum.UNAUTHORIZED)
        .json({ message: "Invalid Email or Password" });
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
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
