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
import { LiquidWebGLBackground, ViewTransition } from "../components/interactions";
import { AnimatedItem } from "../components/AnimatedList";

export default function Dashboard() {
  const { currentUser, isAuthenticated, validateSession } = useAuthStore();
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

  // Strict Authentication Guard
  useEffect(() => {
    const isValid = validateSession();
    if (!isValid) {
      navigate({ to: "/login", replace: true });
    }
  }, [validateSession, navigate]);

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
    if (!currentUser?.id) return [];
    return tasks.filter((t) => t.userId === currentUser.id);
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
    if (!currentUser?.id) return;
    const userId = currentUser.id;
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

  // Block unverified render entirely while redirecting
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B9683E]/15 border border-[#B9683E]/30 flex items-center justify-center text-[#B9683E]">
            <div className="w-5 h-5 rounded-full border-2 border-[#B9683E] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-semibold text-[#617278]">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#F5F2EA] text-[#18262B] flex font-sans antialiased overflow-hidden relative selection:bg-[#B9683E] selection:text-[#FFFCF6]">
      {/* Liquid WebGL Background (React Three Fiber) */}
      <LiquidWebGLBackground />

      {/* KasBan Sidebar - Stays permanently fixed on the left */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenCreateModal={handleOpenCreateModal}
        tasksCountByColumn={tasksCountByColumn}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Workspace Top Header - Stays permanently fixed at the top */}
        <DashboardHeader
          onOpenCreateModal={() => handleOpenCreateModal("todo")}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Scrollable Center Component - ONLY this area moves on scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* KPI Metrics Summary Bar */}
            <AnimatedItem index={0} delay={0.04} duration={0.65} scale={0.96} y={14}>
              <DashboardMetrics tasks={userTasks} />
            </AnimatedItem>

            {/* Search, Filter, Sort Controls */}
            <AnimatedItem index={1} delay={0.10} duration={0.65} scale={0.96} y={14}>
              <DashboardFilters />
            </AnimatedItem>

            {/* View Mode Switching with Smooth GSAP Transition */}
            <ViewTransition viewKey={activeView}>
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
            </ViewTransition>
          </main>
        </div>
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
