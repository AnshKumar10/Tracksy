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
