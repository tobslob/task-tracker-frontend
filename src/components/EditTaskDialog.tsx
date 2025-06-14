import React, { useState, useEffect } from "react";
import { ApiClient } from "../lib/api-client";
import { Task, TaskPriority } from "../lib/types";
import { useTaskStore } from "../lib/task-store";
import { toast } from "react-hot-toast";

interface Props {
  task: Task;
  open: boolean;
  onClose: () => void;
}

export const EditTaskDialog: React.FC<Props> = ({ task, open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending"
  );
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const notifyUpdate = useTaskStore((s) => s.notifyUpdate);

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    }
  }, [open, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dueDate) {
      const selected = new Date(dueDate);
      selected.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        toast.error("Due date cannot be in the past");
        return;
      }
    }
    setLoading(true);
    try {
      await ApiClient.updateTask(task.id, {
        title,
        description,
        priority,
        status,
        dueDate: dueDate || undefined,
      } as any);
      notifyUpdate();
      onClose();
      toast.success("Task updated");
    } catch (err) {
      console.error("Failed to update task", err);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="w-full border rounded-md p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="w-full border rounded-md p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="w-full border rounded-md p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              className="w-full border rounded-md p-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="due">
              Due Date
            </label>
            <input
              id="due"
              type="date"
              className="w-full border rounded-md p-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 border rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
