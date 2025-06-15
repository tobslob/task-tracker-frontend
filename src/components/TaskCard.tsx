import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Task } from "../lib/types";
import { ApiClient } from "../lib/api-client";
import { EditTaskDialog } from "./EditTaskDialog";
import { toast } from "react-hot-toast";
import { Card, Button } from "./ui";

export const TaskCard: React.FC<{ task: Task; onUpdate: () => void }> = ({
  task,
  onUpdate,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (
    newStatus: "pending" | "in-progress" | "completed"
  ) => {
    try {
      if (newStatus === "completed") {
        await ApiClient.markTaskComplete(task.id);
      } else {
        await ApiClient.updateTask(task.id, { status: newStatus });
      }
      onUpdate();
      toast.success("Task updated");
    } catch (err) {
      console.error("Failed to update task", err);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await ApiClient.deleteTask(task.id);
      onUpdate();
      toast.success("Task deleted");
    } catch (err) {
      console.error("Failed to delete task", err);
      toast.error("Failed to delete task");
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 break-words">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 mb-3 break-words">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <span className={`px-2 py-1 rounded ${statusColor(task.status)+ " whitespace-nowrap"}`}>
              {task.status.replace("-", " ")}
            </span>
            <span
              className={`px-2 py-1 rounded ${priorityColor(task.priority)}`}
            >
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex gap-2 mb-2">
            {task.status !== "completed" && (
              <Button
                onClick={() => handleStatusChange("completed")}
                className="px-2 py-1 text-sm"
              >
                Mark Complete
              </Button>
            )}
            {task.status === "pending" && (
              <Button
                onClick={() => handleStatusChange("in-progress")}
                className="px-2 py-1 text-sm"
              >
                Start
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          <Button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1"
            aria-label="Menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 border bg-white rounded shadow-md text-sm z-10">
              <Button
                onClick={() => {
                  setShowEdit(true);
                  setMenuOpen(false);
                }}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      <EditTaskDialog
        task={task}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />
    </Card>
  );
};
