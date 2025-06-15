import React, { useCallback, useEffect, useState } from 'react';
import { ApiClient } from '../lib/api-client';
import { Task, TaskListResponse } from '../lib/types';
import { useTaskStore } from '../lib/task-store';
import { TaskCard } from './TaskCard';
import { TaskFilterBar } from './TaskFilterBar';
import { Button } from "./ui";

const PAGE_SIZE = 20;

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { filters, notifyUpdate, lastUpdated } = useTaskStore();

  useEffect(() => {
    setPage(1);
  }, [filters]);
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const query: Record<string, string> = {
        page: page.toString(),
        page_size: PAGE_SIZE.toString(),
      };
      if (filters.search) query.search = filters.search;
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;

      const data: TaskListResponse = await ApiClient.getTasks(query);
      setTasks(data.founds);
      const total = data.search_options.total_count;
      setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, lastUpdated]);

  const handleTaskUpdate = () => {
    notifyUpdate();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold">Tasks ({tasks.length})</h2>
        <TaskFilterBar />
      </div>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No tasks found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onUpdate={handleTaskUpdate} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm font-medium">{page}</span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
