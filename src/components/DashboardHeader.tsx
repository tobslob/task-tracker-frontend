import React, { useState } from "react";
import { Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTaskStore } from "../lib/task-store";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { ProfileAvatar } from "./ProfileAvatar";

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { filters, setFilters } = useTaskStore();
  const [search, setSearch] = useState(filters.search || "");
  const [showDialog, setShowDialog] = useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters({ search: value });
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-green-700 whitespace-nowrap">
            TASK TRACKER
          </h1>
          <input
            className="w-full sm:w-64 border rounded-md p-2"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex w-full items-center">
          <button
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-1 px-2 py-1 rounded text-sm bg-green-600 text-white whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <ProfileAvatar name={user?.name} email={user?.email} />
            <span className="text-sm hidden lg:inline">
              {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="p-2 border rounded"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <CreateTaskDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </header>
  );
};
