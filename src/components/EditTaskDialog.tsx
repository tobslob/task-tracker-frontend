import React from "react";
import { ApiClient } from "../lib/api-client";
import { Task } from "../lib/types";
import { useTaskStore } from "../lib/task-store";
import { toast } from "react-hot-toast";
import { TaskForm, TaskFormValues } from "./TaskForm";

interface Props {
  task: Task;
  open: boolean;
  onClose: () => void;
}

export const EditTaskDialog: React.FC<Props> = ({ task, open, onClose }) => {
  const notifyUpdate = useTaskStore((s) => s.notifyUpdate);

  const handleSubmit = async (values: TaskFormValues) => {
    await ApiClient.updateTask(task.id, {
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: values.status!,
      dueDate: values.dueDate || undefined,
    } as any);
    notifyUpdate();
    onClose();
    toast.success("Task updated");
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
        <TaskForm
          includeStatus
          submitLabel="Update"
          initialValues={{
            title: task.title,
            description: task.description || "",
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          }}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
