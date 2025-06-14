import React from 'react';
import { useTaskStore } from '../lib/task-store';
import type { TaskPriority } from '../lib/types';

export const TaskFilterBar: React.FC = () => {
  const { filters, setFilters } = useTaskStore();

  return (
    <div className="flex gap-2">
      <select
        className="border rounded-md p-2"
        value={filters.status || 'all'}
        onChange={(e) =>
          setFilters({ status: e.target.value === 'all' ? undefined : e.target.value })
        }
      >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select
        className="border rounded-md p-2"
        value={filters.priority || 'all'}
        onChange={(e) =>
          setFilters({ priority: e.target.value === 'all' ? undefined : (e.target.value as TaskPriority) })
        }
      >
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};
