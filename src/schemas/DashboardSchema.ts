import { z } from "zod";

export const priorityEnum = z.enum(["low", "medium", "high", "urgent"]);
export const columnEnum = z.enum(["todo", "in_progress", "in_review", "done"]);

export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Subtask title is required"),
  completed: z.boolean(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  priority: priorityEnum,
  columnId: columnEnum,
  dueDate: z.string().optional(),
  tags: z.array(z.string()),
  subtasks: z.array(subtaskSchema),
});

export type PriorityType = z.infer<typeof priorityEnum>;
export type ColumnIdType = z.infer<typeof columnEnum>;
export type SubtaskType = z.infer<typeof subtaskSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
