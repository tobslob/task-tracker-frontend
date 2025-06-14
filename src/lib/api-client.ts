import { API_CONFIG, AUTH_TOKEN_KEY } from "./config";
import Cookies from "js-cookie";
import {
  User,
  AuthResponse,
  Task,
  ApiError,
  TaskListResponse,
} from "./types";

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_V1_STR}${endpoint}`;

    const token = Cookies.get(AUTH_TOKEN_KEY);
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (err) {
      throw new Error('Network request failed');
    }

    if (!response.ok) {
      let error: ApiError | undefined;
      try {
        error = await response.json();
      } catch (_) {
        // Ignore JSON parsing errors
      }
      const message = error?.message || error?.detail || response.statusText || "Request failed";
      throw new Error(message);
    }

    return response.json();
  }

  // Auth methods
  static async login(email: string, password: string): Promise<AuthResponse> {
    return this.request(API_CONFIG.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return this.request(API_CONFIG.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  static async logout(): Promise<{ message: string }> {
    return this.request(API_CONFIG.AUTH.LOGOUT, {
      method: "POST",
    });
  }

  static async getCurrentUser(): Promise<User> {
    const data = await this.request<any>(API_CONFIG.AUTH.ME);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.created_at,
    };
  }

  // Task methods
  static async getTasks(query?: Record<string, string>): Promise<TaskListResponse> {
    const params = query ? `?${new URLSearchParams(query).toString()}` : "";
    const data = await this.request<TaskListResponse>(`${API_CONFIG.TASKS}${params}`);
    const tasks = data.founds.map((t) => ({
      id: t.id,
      userId: (t as any).user_id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: (t as any).due_date,
      createdAt: (t as any).created_at,
      updatedAt: (t as any).updated_at,
    }));
    return { founds: tasks, search_options: data.search_options };
  }

  static async createTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> & { userId?: string }
  ): Promise<Task> {
    const payload: any = {
      ...taskData,
      due_date: taskData.dueDate,
    };
    delete payload.dueDate;
    if (taskData.userId) {
      payload.user_id = (taskData as any).userId;
      delete payload.userId;
    }
    const data = await this.request<any>(API_CONFIG.TASKS, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async updateTask(
    id: string,
    taskData: Partial<Omit<Task, "id" | "createdAt"> & { userId?: string }>
  ): Promise<Task> {
    const payload: any = { ...taskData };
    if (taskData.dueDate !== undefined) {
      payload.due_date = taskData.dueDate;
      delete payload.dueDate;
    }
    if ((taskData as any).userId !== undefined) {
      payload.user_id = (taskData as any).userId;
      delete payload.userId;
    }
    const data = await this.request<any>(`${API_CONFIG.TASKS}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async deleteTask(id: string): Promise<{ message: string }> {
    return this.request(`${API_CONFIG.TASKS}/${id}`, {
      method: "DELETE",
    });
  }

  static async markTaskComplete(id: string): Promise<Task> {
    const data = await this.request<any>(`${API_CONFIG.TASKS}/${id}/complete`, {
      method: "POST",
    });
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.due_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

}
