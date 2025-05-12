import { Types } from "mongoose";

export enum UserRolesEnum {
  ADMIN = "admin",
  MEMBER = "member",
}

type UserRoles = UserRolesEnum.ADMIN | UserRolesEnum.MEMBER;

export interface UserInterface {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profilePic: string | null;
  role: UserRoles;
}
