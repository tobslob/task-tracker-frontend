import React, { useState } from "react";
import { ApiClient } from "../lib/api-client";
import { useTaskStore } from "../lib/task-store";
import type { TaskPriority } from "../lib/types";
import { toast } from "react-hot-toast";
import { Input, Button } from "../ui";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateTaskDialog: React.FC<Props> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const notifyUpdate = useTaskStore((s) => s.notifyUpdate);

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
      await ApiClient.createTask({
        title,
        description,
        priority,
        dueDate: dueDate,
        status: "pending",
      } as any);
      notifyUpdate();
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      onClose();
      toast.success("Task created");
    } catch (err) {
      console.error("Failed to create task", err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
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
              required
            />
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
            <Input
              id="due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose}
              className="px-3 py-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create"}
            </Button>
         </div>
        </form>
      </div>
    </div>
  );
};
