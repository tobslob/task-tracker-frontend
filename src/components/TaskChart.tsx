import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ApiClient } from '../lib/api-client';
import { TaskListResponse } from '../lib/types';
import { useTaskStore } from '../lib/task-store';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const TaskChart: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const { lastUpdated } = useTaskStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: TaskListResponse = await ApiClient.getTasks({ page_size: 'all' } as any);
        const tasks = res.founds;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        setData([completed, inProgress, pending]);
      } catch (err) {
        console.error('Failed to fetch chart data', err);
        setData([]);
      }
    };
    fetchData();
  }, [lastUpdated]);

  const chartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Tasks',
        data,
        backgroundColor: ['#16a34a', '#fef9c3', '#ef4444'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#4B5563' },
      },
      x: {
        ticks: { color: '#4B5563' },
      },
    },
  } as const;

  return (
    <div className="bg-white p-4 rounded-md border">
      <h2 className="text-lg font-semibold mb-4">Task Status</h2>
      <div className="h-72">
        {data.length > 0 && data.some(d => d > 0) ? (
          <Bar options={options} data={chartData} />
        ) : (
          <p className="text-center text-gray-500 mt-10">No tasks to display</p>
        )}
      </div>
    </div>
  );
};
