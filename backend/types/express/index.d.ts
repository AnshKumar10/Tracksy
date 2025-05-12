import { TaskInterface } from "types/tasks";
import { UserInterface } from "types/users";

declare global {
  namespace Express {
    interface Request {
      user: UserInterface | null;
      task: TaskInterface | null;
    }
  }
}

// to ensure this file is treated as a module
export {};
