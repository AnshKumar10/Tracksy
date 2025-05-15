import type { UserRoles } from "../enums";

export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
  role: UserRoles;
  token: string;
}
