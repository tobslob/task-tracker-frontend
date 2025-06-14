import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { TaskList } from '../components/TaskList';
import { TaskStats } from '../components/TaskStats';
import { TaskChart } from '../components/TaskChart';

const DashboardPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <DashboardHeader />
    <main className="container mx-auto p-4 space-y-4">
      <TaskStats />
      <TaskChart />
      <TaskList />
    </main>
  </div>
);

export default DashboardPage;
