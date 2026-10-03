import React from "react";
import {
  Kanban,
  ListTodo,
  BarChart3,
  Layers,
  LogOut,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore, type ViewType, type ColumnIdType } from "../../store/taskStore";
import { useNavigate } from "@tanstack/react-router";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: (defaultColumn?: ColumnIdType) => void;
  tasksCountByColumn: Record<ColumnIdType, number>;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
  tasksCountByColumn,
}) => {
  const { currentUser, logout } = useAuthStore();
  const { activeView, setActiveView } = useTaskStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: "board", label: "Board", icon: <Kanban className="w-4 h-4 shrink-0" /> },
    { id: "list", label: "List", icon: <ListTodo className="w-4 h-4 shrink-0" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
  ];

  const workflowStages: { id: ColumnIdType; label: string; dotColor: string }[] = [
    { id: "todo", label: "To Do", dotColor: "bg-[#617278]" },
    { id: "in_progress", label: "In Progress", dotColor: "bg-[#B9683E]" },
    { id: "in_review", label: "In Review", dotColor: "bg-[#B7862D]" },
    { id: "done", label: "Done", dotColor: "bg-[#4F7D61]" },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#18262B]/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container: 230px width with Liquid Glass */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[230px] bg-[#ECE8DE]/80 backdrop-blur-xl border-r border-[#D7D2C7]/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } lg:static lg:h-screen lg:z-auto select-none`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#D7D2C7]/70 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B9683E]/12 border border-[#B9683E]/30 flex items-center justify-center text-[#B9683E]">
                <Layers className="w-4 h-4 text-[#B9683E]" />
              </div>
              <span className="font-bold text-lg text-[#18262B] tracking-tight">
                KasBan
              </span>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/50 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
            {/* Main Views */}
            <div>
              <p className="px-2.5 text-xs font-bold text-[#617278] uppercase tracking-wider mb-2.5">
                Views
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveView(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                        isActive
                          ? "bg-[#B9683E]/10 text-[#B9683E] border-l-[3px] border-[#B9683E]"
                          : "text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/30"
                      }`}
                    >
                      <span className={isActive ? "text-[#B9683E]" : "text-[#617278]"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Workflow Stages */}
            <div>
              <p className="px-2.5 text-xs font-bold text-[#617278] uppercase tracking-wider mb-2.5">
                Workflow
              </p>
              <div className="space-y-1">
                {workflowStages.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setActiveView("board");
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/30 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                      <span>{col.label}</span>
                    </div>
                    <span className="text-xs text-[#617278] font-semibold bg-[#FFFCF6] px-2 py-0.5 rounded-full border border-[#D7D2C7]/60">
                      {tasksCountByColumn[col.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile at Bottom */}
          <div className="p-3 border-t border-[#D7D2C7]/70 shrink-0">
            <div className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl bg-[#FFFCF6]/80 border border-[#D7D2C7]/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#B9683E]/12 border border-[#B9683E]/30 flex items-center justify-center text-sm font-bold text-[#B9683E] shrink-0">
                  {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#18262B] truncate">
                    {currentUser?.username || "Workspace User"}
                  </p>
                  <p className="text-xs text-[#617278] truncate">
                    {currentUser?.email || "user@kasban.io"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-[#617278] hover:text-[#C94B4B] hover:bg-[#C94B4B]/10 rounded-lg transition cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
