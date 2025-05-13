import { Request, Response } from "express";
import { Tasks } from "../models/Tasks";
import { Users } from "../models/Users";
import { TaskStatusEnum } from "../types/tasks";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers";
import { UserRolesEnum } from "../types/users";
import { HttpStatusEnum } from "../types";

/**
 * @route   GET /api/users
 * @desc    Get all users with role 'MEMBER' and their task statistics
 * @access  Private
 */
export const getUsers = async (request: Request, response: Response) => {
  try {
    const users = await Users.find({ role: UserRolesEnum.MEMBER }).select(
      "-password"
    );

    const usersWithTaskStats = await Promise.all(
      users.map(async (user) => {
        const [pendingTasks, inProgressTasks, completedTasks] =
          await Promise.all([
            Tasks.countDocuments({
              assignedTo: user._id,
              status: TaskStatusEnum.PENDING,
            }),
            Tasks.countDocuments({
              assignedTo: user._id,
              status: TaskStatusEnum.IN_PROGRESS,
            }),
            Tasks.countDocuments({
              assignedTo: user._id,
              status: TaskStatusEnum.COMPLETED,
            }),
          ]);

        return {
          ...user.toObject(),
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    response.json(usersWithTaskStats);
  } catch (error) {
    const err = error as Error;
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile by ID
 * @access  Private
 */
export const getUserById = async (request: Request, response: Response) => {
  try {
    const user = await Users.findById(request.params.id).select("-password");

    if (!user) {
      response.status(HttpStatusEnum.NOT_FOUND).json({
        message: "User not found",
      });
    }

    response.json(user);
  } catch (error) {
    const err = error as Error;
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
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
    const userId = request?.user?._id;
    const user = await Users.findById(userId)?.select("-password");

    if (!user) {
      response
        .status(HttpStatusEnum.NOT_FOUND)
        .json({ message: "User not found" });
    }

    response.json(user);
  } catch (error) {
    const err = error as Error;

    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
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
    const userId = request?.user?._id;
    const user = await Users.findById(userId);

    if (!user) {
      response
        .status(HttpStatusEnum.NOT_FOUND)
        .json({ message: "User not found" });
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
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
