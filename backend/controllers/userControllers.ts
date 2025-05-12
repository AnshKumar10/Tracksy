import { Request, Response } from "express";
import { Tasks } from "models/Tasks";
import { Users } from "models/Users";
import { TaskStatusEnum } from "types/tasks";
import { UserRoles } from "types/users";

/**
 * @route   GET /api/users
 * @desc    Get all users with role 'MEMBER' and their task statistics
 * @access  Private
 */
export const getUsers = async (request: Request, response: Response) => {
  try {
    const users = await Users.find({ role: UserRoles.MEMBER }).select(
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
    response.status(500).json({
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
      response.status(404).json({
        message: "User not found",
      });
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
