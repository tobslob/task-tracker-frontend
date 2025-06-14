import { create } from "zustand";

import type { TaskPriority } from './types';

interface TaskFilters {
  search?: string;
  status?: string;
  priority?: TaskPriority;
}

interface TaskStore {
  filters: TaskFilters;
  /**
   * Timestamp that updates whenever a task is modified. Components that
   * need to refetch data can subscribe to this value to know when tasks
   * change without having to pull all of the store's state.
   */
  lastUpdated: number;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  /**
   * Trigger an update notification. This simply updates the
   * `lastUpdated` timestamp.
   */
  notifyUpdate: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  filters: {},
  lastUpdated: Date.now(),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),
  notifyUpdate: () => set({ lastUpdated: Date.now() }),
}));
