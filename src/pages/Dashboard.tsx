import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";
import { useTaskStore, type Task, type ColumnIdType } from "../store/taskStore";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { DashboardFilters } from "../components/dashboard/DashboardFilters";
import { KanbanBoard } from "../components/dashboard/KanbanBoard";
import { TaskListView } from "../components/dashboard/TaskListView";
import { TaskAnalyticsView } from "../components/dashboard/TaskAnalyticsView";
import { TaskModal } from "../components/dashboard/TaskModal";
import { TaskDetailModal } from "../components/dashboard/TaskDetailModal";
import type { TaskFormData } from "../schemas/DashboardSchema";

export default function Dashboard() {
  const { currentUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const {
    tasks,
    searchQuery,
    selectedPriority,
    selectedTag,
    sortBy,
    sortOrder,
    activeView,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useTaskStore();

  // Mobile sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedColumnForNew, setSelectedColumnForNew] = useState<ColumnIdType>("todo");
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Authentication Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  // Keep viewingTask in sync with store updates (e.g. subtask toggled)
  useEffect(() => {
    if (viewingTask) {
      const updated = tasks.find((t) => t.id === viewingTask.id);
      if (updated) {
        setViewingTask(updated);
      }
    }
  }, [tasks, viewingTask]);

  // Filter tasks for current user
  const userTasks = useMemo(() => {
    const currentUserId = currentUser?.id || "guest-user";
    return tasks.filter((t) => t.userId === currentUserId);
  }, [tasks, currentUser?.id]);

  // Column counts for sidebar
  const tasksCountByColumn = useMemo(() => {
    return {
      todo: userTasks.filter((t) => t.columnId === "todo").length,
      in_progress: userTasks.filter((t) => t.columnId === "in_progress").length,
      in_review: userTasks.filter((t) => t.columnId === "in_review").length,
      done: userTasks.filter((t) => t.columnId === "done").length,
    };
  }, [userTasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...userTasks];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q) ||
          task.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Priority filter
    if (selectedPriority !== "all") {
      result = result.filter((task) => task.priority === selectedPriority);
    }

    // Tag filter
    if (selectedTag !== "all") {
      result = result.filter((task) => task.tags.includes(selectedTag));
    }

    // Sorting
    const priorityWeights: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "dueDate": {
          const dateA = a.dueDate || "9999-99-99";
          const dateB = b.dueDate || "9999-99-99";
          comparison = dateA.localeCompare(dateB);
          break;
        }
        case "priority": {
          comparison = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
          break;
        }
        case "title": {
          comparison = a.title.localeCompare(b.title);
          break;
        }
        case "createdAt":
        default: {
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        }
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });

    return result;
  }, [userTasks, searchQuery, selectedPriority, selectedTag, sortBy, sortOrder]);

  // Action handlers
  const handleOpenCreateModal = (defaultCol: ColumnIdType = "todo") => {
    setEditingTask(null);
    setSelectedColumnForNew(defaultCol);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedColumnForNew(task.columnId);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: TaskFormData) => {
    const userId = currentUser?.id || "guest-user";
    if (editingTask) {
      updateTask(editingTask.id, {
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        columnId: data.columnId,
        dueDate: data.dueDate,
        tags: data.tags,
        subtasks: data.subtasks,
      });
    } else {
      addTask(data, userId);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (viewingTask?.id === taskId) {
      setViewingTask(null);
    }
  };

  const handleMoveTask = (taskId: string, targetCol: ColumnIdType) => {
    moveTask(taskId, targetCol);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#18262B] flex font-sans antialiased overflow-x-hidden relative selection:bg-[#B9683E] selection:text-[#FFFCF6]">
      {/* Ambient Liquid Background (Stay strictly behind interface) */}
      <div className="liquid-orb-ocean" aria-hidden="true" />
      <div className="liquid-orb-copper" aria-hidden="true" />
      <div className="liquid-orb-light" aria-hidden="true" />

      {/* KasBan Sidebar */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenCreateModal={handleOpenCreateModal}
        tasksCountByColumn={tasksCountByColumn}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Workspace Top Header */}
        <DashboardHeader
          onOpenCreateModal={() => handleOpenCreateModal("todo")}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* KPI Metrics Summary Bar */}
          <DashboardMetrics tasks={userTasks} />

          {/* Search, Filter, Sort Controls */}
          <DashboardFilters />

          {/* View Mode Switching */}
          {activeView === "board" && (
            <KanbanBoard
              tasks={filteredAndSortedTasks}
              onOpenCreateModal={handleOpenCreateModal}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onViewDetails={(task) => setViewingTask(task)}
            />
          )}

          {activeView === "list" && (
            <TaskListView
              tasks={filteredAndSortedTasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onViewDetails={(task) => setViewingTask(task)}
            />
          )}

          {activeView === "analytics" && (
            <TaskAnalyticsView
              tasks={userTasks}
              onViewDetails={(task) => setViewingTask(task)}
            />
          )}
        </main>
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        defaultColumn={selectedColumnForNew}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={Boolean(viewingTask)}
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
