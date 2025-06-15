import React, { useState, useEffect } from "react";
import { TaskPriority } from "../lib/types";
import { Input, Button } from "./ui";
import { toast } from "react-hot-toast";

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  status?: "pending" | "in-progress" | "completed";
  dueDate: string;
}

interface TaskFormProps {
  initialValues?: Partial<TaskFormValues>;
  includeStatus?: boolean;
  requireDescription?: boolean;
  requireDueDate?: boolean;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialValues = {},
  includeStatus = false,
  requireDescription = false,
  requireDueDate = false,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending"
  );
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialValues.title || "");
    setDescription(initialValues.description || "");
    setPriority(initialValues.priority || "medium");
    setStatus(initialValues.status || "pending");
    setDueDate(
      initialValues.dueDate ? initialValues.dueDate.split("T")[0] : ""
    );
  }, [initialValues]);

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
    } else if (requireDueDate) {
      toast.error("Due date is required");
      return;
    }

    if (requireDescription && !description.trim()) {
      toast.error("Description is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        status: includeStatus ? status : undefined,
        dueDate,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          required={requireDescription}
        />
      </div>
      {includeStatus && (
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
      )}
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
          required={requireDueDate}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={onCancel} className="px-3 py-1">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="px-3 py-1 bg-green-700 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
