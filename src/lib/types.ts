// Auth related types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user_info: User;
  access_token: string;
  expiration: string;
}

// Task related types
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchOptions {
  ordering: string;
  page: number;
  page_size: number | "all";
  total_count: number;
}

export interface TaskListResponse {
  founds: Task[];
  search_options: SearchOptions;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

// Error response
export interface ApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}
