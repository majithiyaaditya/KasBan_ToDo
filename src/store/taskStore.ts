import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PriorityType, ColumnIdType, SubtaskType, TaskFormData } from "../schemas/DashboardSchema";

export type { PriorityType, ColumnIdType, SubtaskType, TaskFormData };

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: PriorityType;
  columnId: ColumnIdType;
  dueDate?: string;
  tags: string[];
  subtasks: SubtaskType[];
  createdAt: string;
  updatedAt: string;
}

export type ViewType = "board" | "list" | "analytics";
export type SortOption = "dueDate" | "priority" | "createdAt" | "title";

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  selectedPriority: string;
  selectedTag: string;
  sortBy: SortOption;
  sortOrder: "asc" | "desc";
  activeView: ViewType;

  // Search & Filter controls
  setSearchQuery: (query: string) => void;
  setSelectedPriority: (priority: string) => void;
  setSelectedTag: (tag: string) => void;
  setSortBy: (sort: SortOption) => void;
  toggleSortOrder: () => void;
  setActiveView: (view: ViewType) => void;
  resetFilters: () => void;

  // Task operations
  addTask: (data: TaskFormData, userId: string) => Task;
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id" | "userId" | "createdAt">>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, targetColumn: ColumnIdType, targetIndex?: number) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  clearUserTasks: (userId: string) => void;
  seedSampleTasksIfEmpty: (userId: string) => void;
  resetUserTasksToDefault: (userId: string) => void;
}

export const COLUMNS: { id: ColumnIdType; title: string; color: string; badgeBg: string; borderTop: string }[] = [
  { id: "todo", title: "To Do", color: "text-[#E9E4DA]", badgeBg: "bg-[#143E48] text-[#91A6A8] border border-[#27515A]", borderTop: "border-[#27515A]" },
  { id: "in_progress", title: "In Progress", color: "text-[#E9E4DA]", badgeBg: "bg-[#143E48] text-[#C47A44] border border-[#C47A44]/50", borderTop: "border-[#C47A44]" },
  { id: "in_review", title: "In Review", color: "text-[#E9E4DA]", badgeBg: "bg-[#143E48] text-[#D3A85C] border border-[#D3A85C]/50", borderTop: "border-[#D3A85C]" },
  { id: "done", title: "Done", color: "text-[#E9E4DA]", badgeBg: "bg-[#143E48] text-[#6F9275] border border-[#6F9275]/50", borderTop: "border-[#6F9275]" },
];

export const AVAILABLE_TAGS = [
  "Frontend",
  "Backend",
  "UI/UX",
  "Bug",
  "Feature",
  "DevOps",
  "Research",
  "Testing",
];

const getSampleTasks = (userId: string): Task[] => {
  const today = new Date();
  const getOffsetDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  return [
    {
      id: "task-1",
      userId,
      title: "Design Responsive Kanban Board Layout",
      description: "Craft a modern, high-contrast dashboard with sticky headers, quick metrics, and drag-and-drop support.",
      priority: "high",
      columnId: "in_progress",
      dueDate: getOffsetDate(1),
      tags: ["UI/UX", "Frontend"],
      subtasks: [
        { id: "sub-1-1", title: "Create Column containers", completed: true },
        { id: "sub-1-2", title: "Design Task card micro-interactions", completed: true },
        { id: "sub-1-3", title: "Add Drag & Drop visual indicators", completed: false },
      ],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "task-2",
      userId,
      title: "Implement Task Filtering & Search",
      description: "Enable real-time search across task titles, tags, and priority levels with instant updates.",
      priority: "medium",
      columnId: "in_review",
      dueDate: getOffsetDate(2),
      tags: ["Frontend", "Feature"],
      subtasks: [
        { id: "sub-2-1", title: "Fuzzy search implementation", completed: true },
        { id: "sub-2-2", title: "Priority dropdown filter", completed: true },
      ],
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "task-3",
      userId,
      title: "Set up Multi-user State Isolation",
      description: "Ensure tasks are scoped per authenticated user ID so every user has their own private workspace.",
      priority: "urgent",
      columnId: "done",
      dueDate: getOffsetDate(-1),
      tags: ["Backend", "Feature"],
      subtasks: [
        { id: "sub-3-1", title: "Scope localStorage keys with userId", completed: true },
        { id: "sub-3-2", title: "Auto-seed sample data on first login", completed: true },
      ],
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "task-4",
      userId,
      title: "Add Task Analytics & Productivity Score",
      description: "Calculate completion rates, distribution of priorities, and pending deadlines for the summary view.",
      priority: "low",
      columnId: "todo",
      dueDate: getOffsetDate(4),
      tags: ["Research", "Feature"],
      subtasks: [
        { id: "sub-4-1", title: "Design KPI status cards", completed: false },
        { id: "sub-4-2", title: "Implement progress bar calculations", completed: false },
      ],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "task-5",
      userId,
      title: "Refactor API Error Handling & Toasts",
      description: "Provide friendly feedback toasts whenever a task is created, moved, or deleted.",
      priority: "medium",
      columnId: "todo",
      dueDate: getOffsetDate(5),
      tags: ["Frontend", "Testing"],
      subtasks: [
        { id: "sub-5-1", title: "Configure toast notifications", completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      searchQuery: "",
      selectedPriority: "all",
      selectedTag: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      activeView: "board",

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedPriority: (priority) => set({ selectedPriority: priority }),
      setSelectedTag: (tag) => set({ selectedTag: tag }),
      setSortBy: (sortBy) => set({ sortBy }),
      toggleSortOrder: () => set({ sortOrder: get().sortOrder === "asc" ? "desc" : "asc" }),
      setActiveView: (activeView) => set({ activeView }),
      resetFilters: () =>
        set({
          searchQuery: "",
          selectedPriority: "all",
          selectedTag: "all",
          sortBy: "createdAt",
          sortOrder: "desc",
        }),

      // Do NOT auto-seed demo tasks by default! Keep board empty until user adds tasks
      seedSampleTasksIfEmpty: (_userId: string) => {
        // Disabled: User's workspace starts clean, and deleting tasks preserves empty state
      },

      // Explicitly load demo tasks only if user requests it via menu
      resetUserTasksToDefault: (userId: string) => {
        const otherUserTasks = get().tasks.filter((t) => t.userId !== userId);
        const sampleTasks = getSampleTasks(userId);
        set({
          tasks: [...otherUserTasks, ...sampleTasks],
        });
      },

      // Delete all tasks belonging to the current user
      clearUserTasks: (userId: string) => {
        set({
          tasks: get().tasks.filter((t) => t.userId !== userId),
        });
      },

      addTask: (data, userId) => {
        const newTask: Task = {
          id: `task-${crypto.randomUUID()}`,
          userId,
          title: data.title,
          description: data.description || "",
          priority: data.priority,
          columnId: data.columnId,
          dueDate: data.dueDate,
          tags: data.tags || [],
          subtasks: data.subtasks || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          tasks: [newTask, ...get().tasks],
        });

        return newTask;
      },

      updateTask: (taskId, updates) => {
        set({
          tasks: get().tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        });
      },

      deleteTask: (taskId) => {
        set({
          tasks: get().tasks.filter((task) => task.id !== taskId),
        });
      },

      moveTask: (taskId, targetColumn, targetIndex) => {
        const tasks = [...get().tasks];
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return;

        const [movedTask] = tasks.splice(taskIndex, 1);
        movedTask.columnId = targetColumn;
        movedTask.updatedAt = new Date().toISOString();

        if (typeof targetIndex === "number" && targetIndex >= 0) {
          tasks.splice(targetIndex, 0, movedTask);
        } else {
          tasks.push(movedTask);
        }

        set({ tasks });
      },

      toggleSubtask: (taskId, subtaskId) => {
        set({
          tasks: get().tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.map((sub) =>
                sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        });
      },

      addSubtask: (taskId, title) => {
        set({
          tasks: get().tasks.map((task) => {
            if (task.id !== taskId) return task;
            const newSub: SubtaskType = {
              id: `sub-${crypto.randomUUID()}`,
              title,
              completed: false,
            };
            return {
              ...task,
              subtasks: [...task.subtasks, newSub],
              updatedAt: new Date().toISOString(),
            };
          }),
        });
      },

      removeSubtask: (taskId, subtaskId) => {
        set({
          tasks: get().tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: task.subtasks.filter((sub) => sub.id !== subtaskId),
              updatedAt: new Date().toISOString(),
            };
          }),
        });
      },
    }),
    {
      name: "kasban-task-store",
    }
  )
);
