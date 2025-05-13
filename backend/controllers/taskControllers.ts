import { Request, Response } from "express";
import { Types } from "mongoose";
import { Tasks } from "../models/Tasks";
import { UserRolesEnum } from "../types/users";
import { TaskStatusEnum, TaskPriorityEnum } from "../types/tasks";
import { HttpStatusEnum } from "../types";

/** Utility: Check if user is admin */
const isAdmin = (role?: string): boolean => role === UserRolesEnum.ADMIN;

/** Utility: Check if the user is authorized for the task */
const isUserAuthorized = (
  userId: Types.ObjectId | undefined,
  assignedTo: Types.ObjectId[] | undefined,
  role: string | undefined
): boolean => {
  if (isAdmin(role)) return true;
  return (
    assignedTo?.some((id) => id.toString() === userId?.toString()) || false
  );
};

/** Utility: Prepare Dashboard Report  */
export const generateDashboardReport = async (
  match: Record<string, any> = {}
) => {
  const [
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overDueTasks,
  ] = await Promise.all([
    Tasks.countDocuments(match),
    Tasks.countDocuments({ ...match, status: TaskStatusEnum.PENDING }),
    Tasks.countDocuments({ ...match, status: TaskStatusEnum.IN_PROGRESS }),
    Tasks.countDocuments({ ...match, status: TaskStatusEnum.COMPLETED }),
    Tasks.countDocuments({
      ...match,
      status: { $ne: TaskStatusEnum.COMPLETED },
      dueDate: { $lt: new Date() },
    }),
  ]);

  const taskDistributionRaw = await Tasks.aggregate([
    ...(Object.keys(match).length > 0 ? [{ $match: match }] : []),
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const taskPriorityRaw = await Tasks.aggregate([
    ...(Object.keys(match).length > 0 ? [{ $match: match }] : []),
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const taskDistribution = Object.values(TaskStatusEnum).reduce(
    (acc, status) => {
      const key = status.replace(/\s+/g, "");
      acc[key] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    },
    {} as Record<string, number>
  );

  taskDistribution["All"] = totalTasks;

  const taskPriority = Object.values(TaskPriorityEnum).reduce(
    (acc, priority) => {
      const key = priority.replace(/\s+/g, "");
      acc[key] =
        taskPriorityRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    },
    {} as Record<string, number>
  );

  const recentTasks = await Tasks.find(match)
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt");

  return {
    statistics: {
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
      overDueTasks,
    },
    charts: {
      taskDistribution,
      taskPriority,
    },
    recentTasks,
  };
};

/**
 * @route   GET /api/tasks
 * @desc    Get tasks for current user or all if admin
 * @access  Private
 */
export const getTasks = async (request: Request, response: Response) => {
  try {
    const { status } = request.query;
    const user = request.user;
    const filter: any = status ? { status } : {};

    const query = isAdmin(user?.role)
      ? filter
      : { ...filter, assignedTo: user?._id };

    const tasks = await Tasks.find(query).populate(
      "assignedTo",
      "name email profilePic"
    );

    const allTasks = await Promise.all(
      tasks.map((task) => {
        const completedTodoCount =
          task.todoChecklist?.filter((todo) => todo.completed)?.length || 0;
        return { ...task.toObject(), completedTodoCount };
      })
    );

    const [
      allTasksCount,
      pendingTasksCount,
      inProgressTasksCount,
      completedTasksCount,
    ] = await Promise.all([
      Tasks.countDocuments(
        isAdmin(user?.role) ? {} : { assignedTo: user?._id }
      ),
      Tasks.countDocuments({
        ...filter,
        status: TaskStatusEnum.PENDING,
        ...(isAdmin(user?.role) ? {} : { assignedTo: user?._id }),
      }),
      Tasks.countDocuments({
        ...filter,
        status: TaskStatusEnum.IN_PROGRESS,
        ...(isAdmin(user?.role) ? {} : { assignedTo: user?._id }),
      }),
      Tasks.countDocuments({
        ...filter,
        status: TaskStatusEnum.COMPLETED,
        ...(isAdmin(user?.role) ? {} : { assignedTo: user?._id }),
      }),
    ]);

    response.json({
      tasks: allTasks,
      summary: {
        allTasksCount,
        pendingTasksCount,
        completedTasksCount,
        inProgressTasksCount,
      },
    });
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch tasks",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a task by ID
 * @access  Private
 */
export const getTaskById = async (request: Request, response: Response) => {
  try {
    const task = await Tasks.findById(request.params.id).populate(
      "assignedTo",
      "name email profilePic"
    );

    if (!task)
      response
        .status(HttpStatusEnum.NOT_FOUND)
        .json({ message: "Task not found" });

    response.json(task);
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve task",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
export const createTask = async (request: Request, response: Response) => {
  try {
    const task = request.body;

    if (!Array.isArray(task.assignedTo)) {
      response
        .status(HttpStatusEnum.BAD_REQUEST)
        .json({ message: "Assigned To must be an array of User IDs" });
    }

    const createdTask = await Tasks.create({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo,
      todoChecklist: task.todoChecklist,
    });

    response
      .status(HttpStatusEnum.CREATED)
      .json({ message: "Task created successfully", createdTask });
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create task",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
export const updateTask = async (request: Request, response: Response) => {
  try {
    const task = await Tasks.findById(request.params.id);

    if (!task) {
      response
        .status(HttpStatusEnum.NOT_FOUND)
        .json({ message: "Task not found" });
      return;
    }

    Object.assign(task, {
      title: request.body.title ?? task.title,
      description: request.body.description ?? task.description,
      priority: request.body.priority ?? task.priority,
      dueDate: request.body.dueDate ?? task.dueDate,
      todoChecklist: request.body.todoChecklist ?? task.todoChecklist,
    });

    if (request.body.assignedTo) {
      if (!Array.isArray(request.body.assignedTo)) {
        response
          .status(HttpStatusEnum.BAD_REQUEST)
          .json({ message: "Assigned To must be an array of User IDs" });
      }
      task.assignedTo = request.body.assignedTo;
    }

    const updatedTask = await task.save();
    response.json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update task",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
export const deleteTask = async (request: Request, response: Response) => {
  try {
    const task = await Tasks.findById(request.params.id);
    if (!task) {
      response
        .status(HttpStatusEnum.NOT_FOUND)
        .json({ message: "Task not found" });
      return;
    }

    await task.deleteOne();
    response.json({ message: "Task deleted successfully" });
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete task",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update a task's status
 * @access  Private
 */
export const updateTaskStatus = async (
  request: Request,
  response: Response
) => {
  try {
    const task = await Tasks.findById(request.params.id);

    if (!task) {
      response
        .status(HttpStatusEnum.NOT_FOUND)
        .json({ message: "Task not found" });
      return;
    }

    if (
      !isUserAuthorized(request.user?._id, task.assignedTo, request.user?.role)
    ) {
      response
        .status(HttpStatusEnum.FORBIDDEN)
        .json({ message: "Not authorized to update status" });
    }

    task.status = request.body.status || task.status;

    if (task.status === TaskStatusEnum.COMPLETED) {
      task.todoChecklist?.forEach((todo) => (todo.completed = true));
      task.progress = 100;
    }

    await task.save();
    response.json({ message: "Task status updated", task });
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update status",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   PATCH /api/tasks/:id/todo
 * @desc    Update task checklist and progress
 * @access  Private
 */
export const updateTaskChecklist = async (
  request: Request,
  response: Response
) => {
  try {
    const { todoChecklist } = request.body;
    const task = await Tasks.findById(request.params.id);

    if (!task) {
      response
        .status(HttpStatusEnum.NOT_FOUND)
        .json({ message: "Task not found" });
      return;
    }

    if (
      !isUserAuthorized(request.user?._id, task.assignedTo, request.user?.role)
    ) {
      response
        .status(HttpStatusEnum.FORBIDDEN)
        .json({ message: "Not authorized to update checklist" });
    }

    task.todoChecklist = todoChecklist;

    const completedCount =
      todoChecklist.filter((todo: any) => todo.completed)?.length || 0;
    const total = todoChecklist.length;

    task.progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    task.status =
      task.progress === 100
        ? TaskStatusEnum.COMPLETED
        : task.progress > 0
        ? TaskStatusEnum.IN_PROGRESS
        : TaskStatusEnum.PENDING;

    await task.save();

    const updatedTask = await Tasks.findById(task._id).populate(
      "assignedTo",
      "name email profilePic"
    );

    response.json({ message: "Checklist updated", updatedTask });
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update checklist",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   GET /api/tasks/dashboard-report
 * @desc    Get dashboard report for admin
 * @access  Private/Admin
 */
export const getDashboardReport = async (
  request: Request,
  response: Response
) => {
  try {
    const report = await generateDashboardReport();
    response.json(report);
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch dashboard report",
      error: (error as Error).message,
    });
  }
};

/**
 * @route   GET /api/tasks/user-dashboard-report
 * @desc    Get dashboard report for logged-in user
 * @access  Private
 */
export const getUserSpecificDashboardReport = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request.user?._id;
    const report = await generateDashboardReport({ assignedTo: userId });
    response.json(report);
  } catch (error) {
    response.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch user dashboard report",
      error: (error as Error).message,
    });
  }
};
