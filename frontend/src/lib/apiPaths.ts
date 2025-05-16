import {
  LayoutDashboard,
  ClipboardList,
  PlusSquare,
  Users,
  ListTodo,
  FileText,
} from "lucide-react";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },
  USER: {
    GET_ALL_USERS: "/users",
    GET_PROFILE: "/users/profile",
    GET_USER: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: "/users/profile",
    UPLOAD_IMAGE: "/users/upload-image",
  },
  TASKS: {
    GET_ALL: "/tasks",
    GET_SINGLE: (id: string) => `/tasks/${id}`,
    CREATE: "/tasks",
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    UPDATE_STATUS: (id: string) => `/tasks/${id}/status`,
    UPDATE_CHECKLIST: (id: string) => `/tasks/${id}/todo`,
  },
  REPORTS: {
    DASHBOARD_REPORT: "/tasks/dashboard-report",
    USER_DASHBOARD_REPORT: "/tasks/user-dashboard-report",
  },
};

export const ADMIN_ROUTES = [
  {
    id: "admin_dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "admin_manage_tasks",
    label: "Manage Tasks",
    path: "/admin/tasks",
    icon: ClipboardList,
  },
  {
    id: "admin_create_task",
    label: "Create Task",
    path: "/admin/create-task",
    icon: PlusSquare,
  },
  {
    id: "admin_manage_users",
    label: "Manage Users",
    path: "/admin/users",
    icon: Users,
  },
];

export const USER_ROUTES = [
  {
    id: "user_dashboard",
    label: "Dashboard",
    path: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "user_my_tasks",
    label: "My Tasks",
    path: "/user/tasks",
    icon: ListTodo,
  },
  {
    id: "user_task_details",
    label: "Task Details",
    path: "/user/task-details/:id",
    icon: FileText,
  },
];
