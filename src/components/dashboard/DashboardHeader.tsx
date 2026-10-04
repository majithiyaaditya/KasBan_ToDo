import React, { useState, useRef, useEffect } from "react";
import {
  Kanban,
  ListTodo,
  BarChart3,
  Plus,
  Menu,
  MoreVertical,
  Trash2,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore, type ViewType } from "../../store/taskStore";
import { useNavigate } from "@tanstack/react-router";
import { MagneticButton } from "../interactions";
import RubberSegment from "./RubberSegment";
import { AnimatedItem } from "../AnimatedList";

interface DashboardHeaderProps {
  onOpenCreateModal: () => void;
  onToggleSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenCreateModal,
  onToggleSidebar,
}) => {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const { activeView, setActiveView, clearUserTasks } = useTaskStore();
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

  const handleClearAllTasks = () => {
    setIsMenuOpen(false);
    if (currentUser?.id) {
      if (window.confirm("Are you sure you want to delete all your tasks? This cannot be undone.")) {
        clearUserTasks(currentUser.id);
      }
    }
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate({ to: "/login" });
  };


  return (
    <header className="bg-[#FFFCF6]/75 backdrop-blur-xl border-b border-[#D7D2C7]/70 sticky top-0 z-30 select-none glass-panel shrink-0">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Mobile Toggle & Workspace title */}
          <AnimatedItem index={0} delay={0.02} duration={0.55} scale={0.96} y={6} className="flex items-center">
            <div className="flex items-center gap-3">
              {onToggleSidebar && (
                <MagneticButton
                  type="button"
                  onClick={onToggleSidebar}
                  className="lg:hidden p-1.5 rounded-lg text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/40 transition cursor-pointer"
                  title="Toggle menu"
                  strength={0.2}
                >
                  <Menu className="w-5 h-5" />
                </MagneticButton>
              )}

              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-[#18262B] tracking-tight font-heading">
                  My Workspace
                </span>
                <span className="text-xs font-semibold text-[#617278] bg-[#ECE8DE] px-2.5 py-0.5 rounded-md border border-[#D7D2C7]/60 hidden sm:inline">
                  {currentUser?.username || "Personal"}
                </span>
              </div>
            </div>
          </AnimatedItem>

          {/* Center: View Switcher */}
          <AnimatedItem index={1} delay={0.06} duration={0.55} scale={0.96} y={6} className="hidden sm:flex items-center justify-center">
            <RubberSegment
              items={[
                { value: "board", label: "Board", icon: <Kanban className="w-5 h-5" /> },
                { value: "list", label: "List", icon: <ListTodo className="w-5 h-5" /> },
                { value: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> }
              ]}
              value={activeView}
              defaultValue="board"
              onChange={(value, index) => {
                console.log(value, index);
                setActiveView(value as ViewType);
              }}
              trackColor="#d5c7c0ff"
              thumbColor="#b9683e"
              textColor="#222222cc"
              activeTextColor="#ffffff"
              hoverTextColor="#11111180"
              size="md"
              radius={13}
              inset={4}
              equalSlots
              stretch={100}
              squash={2.5}
              speed={0.9}
              glide={75}
              draggable
            />
          </AnimatedItem>

          {/* Right Action: + New Task CTA & Secondary Menu */}
          <AnimatedItem index={2} delay={0.10} duration={0.55} scale={0.96} y={6} className="flex items-center gap-2.5">
            <div className="flex items-center gap-2.5">
              <MagneticButton
                type="button"
                onClick={onOpenCreateModal}
                className="flex items-center gap-2 bg-[#B9683E] hover:bg-[#98502F] text-[#FFFCF6] px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition duration-150 cursor-pointer"
                strength={0.28}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Task</span>
              </MagneticButton>

              {/* Discreet Secondary Actions Menu */}
              <div className="relative" ref={menuRef}>
                <MagneticButton
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-[#617278] hover:text-[#18262B] hover:bg-[#D7D2C7]/40 rounded-lg transition cursor-pointer"
                  title="More workspace options"
                  strength={0.2}
                >
                  <MoreVertical className="w-4 h-4" />
                </MagneticButton>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-[#FFFCF6]/95 backdrop-blur-xl border border-[#D7D2C7] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#D7D2C7]/50">
                    <button
                      type="button"
                      onClick={handleClearAllTasks}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#C94B4B] hover:bg-[#C94B4B]/10 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All Tasks</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#18262B] hover:bg-[#ECE8DE]/60 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#617278]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </AnimatedItem>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex sm:hidden border-t border-[#D7D2C7]/60 py-2 justify-center">
          <RubberSegment
            items={[
              { value: "board", label: "Board", icon: <Kanban className="w-3.5 h-3.5" /> },
              { value: "list", label: "List", icon: <ListTodo className="w-3.5 h-3.5" /> },
              { value: "analytics", label: "Analytics", icon: <BarChart3 className="w-3.5 h-3.5" /> }
            ]}
            value={activeView}
            defaultValue="board"
            onChange={(value, index) => {
              console.log(value, index);
              setActiveView(value as ViewType);
            }}
            trackColor="#202020"
            thumbColor="#b9683e"
            textColor="#fafafa"
            activeTextColor="#ffffff"
            hoverTextColor="#ffffff"
            size="sm"
            radius={10}
            inset={3}
            equalSlots
            stretch={100}
            squash={2.5}
            speed={0.9}
            glide={75}
            draggable
          />
        </div>
      </div>
    </header>
  );
};
