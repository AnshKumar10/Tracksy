import { Types } from "mongoose";

export enum TaskPriorityEnum {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum TaskStatusEnum {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export type TaskPriority =
  | TaskPriorityEnum.LOW
  | TaskPriorityEnum.MEDIUM
  | TaskPriorityEnum.HIGH;

export type TaskStatus =
  | TaskStatusEnum.PENDING
  | TaskStatusEnum.IN_PROGRESS
  | TaskStatusEnum.COMPLETED;

export interface TaskTodoInterface {
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskInterface {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  assignedTo: Types.ObjectId[];
  todoChecklist: TaskTodoInterface[];
  progress: number;
}
