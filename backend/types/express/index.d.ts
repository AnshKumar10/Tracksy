import { UserInterface } from "types/users";

declare global {
  namespace Express {
    interface Request {
      user: UserInterface | null;
    }
  }
}

// to ensure this file is treated as a module
export {};
