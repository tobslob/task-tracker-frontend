export const API_CONFIG = {
  BASE_URL: process.env.VUE_APP_API_URL || "http://localhost:8000",
  API_V1_STR: "/api/v1",
  AUTH: {
    LOGIN: "/auth/sign-in",
    REGISTER: "/auth/sign-up",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  TASKS: "/task",
};

export const AUTH_TOKEN_KEY = "auth-token";
