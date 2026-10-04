import React, { useRef } from "react";
import {
  Kanban,
  ListTodo,
  BarChart3,
  Layers,
  LogOut,
  X,
  Plus,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore, type ViewType, type ColumnIdType } from "../../store/taskStore";
import { useNavigate } from "@tanstack/react-router";
import RubberSegment from "./RubberSegment";
import { AnimatedItem } from "../AnimatedList";
import { SidebarBackground } from "./SidebarBackground";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal?: (defaultColumn?: ColumnIdType) => void;
  tasksCountByColumn: Record<ColumnIdType, number>;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
  onOpenCreateModal,
  tasksCountByColumn,
}) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const { currentUser, logout } = useAuthStore();
  const { activeView, setActiveView } = useTaskStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const navItems = [
    { value: "board", label: "Board", icon: <Kanban className="w-4 h-4 shrink-0" /> },
    { value: "list", label: "List", icon: <ListTodo className="w-4 h-4 shrink-0" /> },
    { value: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
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

      {/* Sidebar Container: Frosted Glass connected with Dashboard background */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[#ECE8DE]/65 backdrop-blur-2xl border-r border-[#D7D2C7]/70 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } lg:static lg:h-screen lg:shrink-0 lg:z-10 select-none glass-panel relative overflow-hidden`}
      >
        {/* Dynamic Animated Liquid Background */}
        <SidebarBackground containerRef={sidebarRef} />

        <div className="flex flex-col h-full relative z-10">
          {/* Brand Header: Aligned to h-14 (56px) to match DashboardHeader seamlessly */}
          <AnimatedItem index={0} delay={0.02} duration={0.55} scale={0.96} y={6}>
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#D7D2C7]/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#B9683E]/15 border border-[#B9683E]/30 flex items-center justify-center text-[#B9683E] shadow-2xs">
                  <Layers className="w-4 h-4 text-[#B9683E]" />
                </div>
                <span className="font-bold text-lg text-[#18262B] tracking-tight font-heading">
                  KasBan
                </span>
              </div>

              {/* Mobile close button (Standard button without magnetic effect) */}
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-md text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/50 active:scale-95 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </AnimatedItem>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
            {/* Views Section with RubberSegment (Vertical rubber animation) */}
            <AnimatedItem index={1} delay={0.08} duration={0.55} scale={0.96} y={8}>
              <div>
                <p className="px-2 text-xs font-bold text-[#617278] uppercase tracking-wider mb-2">
                  Views
                </p>
                <RubberSegment
                  orientation="vertical"
                  items={navItems}
                  value={activeView}
                  defaultValue="board"
                  onChange={(value) => {
                    setActiveView(value as ViewType);
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  trackColor="#ECE8DE"
                  thumbColor="#b9683e"
                  textColor="#617278"
                  hoverTextColor="#18262B"
                  activeTextColor="#ffffff"
                  size="md"
                  radius={12}
                  inset={3}
                  equalSlots
                  stretch={30}
                  squash={1.2}
                  speed={1.15}
                  glide={45}
                  draggable={false}
                />

                {/* Quick Task CTA Button (Standard button without magnetic effect) */}
                {onOpenCreateModal && (
                  <div className="pt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenCreateModal("todo");
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#B9683E]/12 hover:bg-[#B9683E] text-[#B9683E] hover:text-[#FFFCF6] border border-[#B9683E]/30 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs hover:shadow-xs active:scale-[0.98] transition duration-150 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Quick Task</span>
                    </button>
                  </div>
                )}
              </div>
            </AnimatedItem>

            {/* Workflow Stages (Standard button without magnetic effect) */}
            <AnimatedItem index={2} delay={0.14} duration={0.55} scale={0.96} y={8}>
              <div>
                <p className="px-2 text-xs font-bold text-[#617278] uppercase tracking-wider mb-2">
                  Workflow
                </p>
                <div className="space-y-1">
                  {workflowStages.map((col) => {
                    const badgeStyle =
                      col.id === "in_progress"
                        ? "bg-[#B9683E]/15 text-[#B9683E] border-[#B9683E]/35 font-bold"
                        : col.id === "todo"
                        ? "bg-[#173B4A]/10 text-[#173B4A] border-[#173B4A]/25 font-bold"
                        : col.id === "in_review"
                        ? "bg-[#B7862D]/15 text-[#B7862D] border-[#B7862D]/35 font-bold"
                        : "bg-[#4F7D61]/15 text-[#4F7D61] border-[#4F7D61]/35 font-bold";

                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          setActiveView("board");
                          onClose();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE]/80 active:scale-[0.99] transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${col.dotColor} shadow-2xs`} />
                          <span>{col.label}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border shadow-2xs ${badgeStyle}`}>
                          {tasksCountByColumn[col.id] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimatedItem>
          </div>

          {/* User Profile at Bottom (Standard button without magnetic effect) */}
          <div className="p-3 border-t border-[#D7D2C7]/70 shrink-0">
            <AnimatedItem index={3} delay={0.20} duration={0.55} scale={0.96} y={8}>
              <div className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl bg-[#FFFCF6]/70 backdrop-blur-md border border-[#D7D2C7]/60 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#B9683E]/15 border border-[#B9683E]/30 flex items-center justify-center text-sm font-bold text-[#B9683E] shrink-0">
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
                  className="p-1.5 text-[#617278] hover:text-[#C94B4B] hover:bg-[#C94B4B]/10 active:scale-95 rounded-lg transition cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </AnimatedItem>
          </div>
        </div>
      </aside>
    </>
  );
};
