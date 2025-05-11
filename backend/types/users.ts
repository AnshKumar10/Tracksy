export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePic: string | null;
  role: "member" | "admin";
}

export enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
}
