import React, { useState, useRef, useEffect } from "react";
import { 
  Kanban, 
  ListTodo, 
  BarChart3, 
  Plus, 
  Menu,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";

interface DashboardHeaderProps {
  onOpenCreateModal: () => void;
  onToggleSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onOpenCreateModal,
  onToggleSidebar,
}) => {
  const { currentUser } = useAuthStore();
  const { activeView, setActiveView, resetUserTasksToDefault, clearUserTasks } = useTaskStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetSampleData = () => {
    setIsMenuOpen(false);
    if (currentUser?.id) {
      if (window.confirm("Load sample demonstration tasks into your workspace?")) {
        resetUserTasksToDefault(currentUser.id);
      }
    }
  };

  const handleClearAllTasks = () => {
    setIsMenuOpen(false);
    if (currentUser?.id) {
      if (window.confirm("Are you sure you want to delete all your tasks? This cannot be undone.")) {
        clearUserTasks(currentUser.id);
      }
    }
  };

  return (
    <header className="bg-[#FFFCF6]/75 backdrop-blur-xl border-b border-[#D7D2C7]/70 sticky top-0 z-30 select-none glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Mobile Toggle & Workspace title */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 rounded-lg text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/40 transition cursor-pointer"
                title="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-[#18262B] tracking-tight">
                My Workspace
              </span>
              <span className="text-xs font-semibold text-[#617278] bg-[#ECE8DE] px-2.5 py-0.5 rounded-md border border-[#D7D2C7]/60 hidden sm:inline">
                {currentUser?.username || "Personal"}
              </span>
            </div>
          </div>

          {/* Center: View Switcher */}
          <div className="hidden sm:flex items-center bg-[#ECE8DE]/80 p-1 rounded-xl border border-[#D7D2C7]/70">
            <button
              type="button"
              onClick={() => setActiveView("board")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeView === "board"
                  ? "bg-[#B9683E] text-[#FFFCF6] font-semibold shadow-xs"
                  : "text-[#617278] hover:text-[#18262B]"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("list")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeView === "list"
                  ? "bg-[#B9683E] text-[#FFFCF6] font-semibold shadow-xs"
                  : "text-[#617278] hover:text-[#18262B]"
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("analytics")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeView === "analytics"
                  ? "bg-[#B9683E] text-[#FFFCF6] font-semibold shadow-xs"
                  : "text-[#617278] hover:text-[#18262B]"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>

          {/* Right Action: + New Task CTA & Secondary Menu */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 bg-[#B9683E] hover:bg-[#98502F] text-[#FFFCF6] px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Task</span>
            </button>

            {/* Discreet Secondary Actions Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/40 rounded-lg transition cursor-pointer"
                title="More workspace options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-[#FFFCF6]/95 backdrop-blur-xl border border-[#D7D2C7] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#D7D2C7]/50">
                  <button
                    type="button"
                    onClick={handleResetSampleData}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE]/60 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#B9683E]" />
                    <span>Load Demo Tasks</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllTasks}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#C94B4B] hover:bg-[#C94B4B]/10 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Tasks</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex sm:hidden border-t border-[#D7D2C7]/60 py-2 justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveView("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === "board"
                ? "bg-[#B9683E] text-[#FFFCF6] font-semibold"
                : "text-[#617278]"
            }`}
          >
            <Kanban className="w-4 h-4" />
            Board
          </button>
          <button
            type="button"
            onClick={() => setActiveView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === "list"
                ? "bg-[#B9683E] text-[#FFFCF6] font-semibold"
                : "text-[#617278]"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            List
          </button>
          <button
            type="button"
            onClick={() => setActiveView("analytics")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === "analytics"
                ? "bg-[#B9683E] text-[#FFFCF6] font-semibold"
                : "text-[#617278]"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
