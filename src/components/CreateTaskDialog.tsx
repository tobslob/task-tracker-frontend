import React from "react";
import { ApiClient } from "../lib/api-client";
import { useTaskStore } from "../lib/task-store";
import { toast } from "react-hot-toast";
import { TaskForm, TaskFormValues } from "./TaskForm";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateTaskDialog: React.FC<Props> = ({ open, onClose }) => {
  const notifyUpdate = useTaskStore((s) => s.notifyUpdate);

  const handleSubmit = async (values: TaskFormValues) => {
    await ApiClient.createTask({
      title: values.title,
      description: values.description,
      priority: values.priority,
      dueDate: values.dueDate,
      status: "pending",
    } as any);
    notifyUpdate();
    onClose();
    toast.success("Task created");
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
        <TaskForm
          submitLabel="Create"
          requireDescription
          requireDueDate
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
