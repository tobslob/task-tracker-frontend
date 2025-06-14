import React, { useEffect, useState } from 'react';
import { ApiClient } from '../lib/api-client';
import type { TaskStats as TaskStatsType, TaskListResponse } from '../lib/types';
import { BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTaskStore } from '../lib/task-store';


export const TaskStats: React.FC = () => {
  const [stats, setStats] = useState<TaskStatsType>({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const lastUpdated = useTaskStore((s) => s.lastUpdated);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data: TaskListResponse = await ApiClient.getTasks({ page_size: 'all' } as any);
        const tasks = data.founds;
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'completed').length;
        const pending = tasks.filter((t) => t.status === 'pending').length;
        const overdue = tasks.filter(
          (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length;
        setStats({ total, completed, pending, overdue });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, [lastUpdated]);

  const statCards = [
    { title: 'Total Tasks', value: stats.total, icon: BarChart3, color: 'text-blue-600' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600' },
    { title: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-600' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.title} className="p-4 border rounded-md bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{stat.title}</span>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-center">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
