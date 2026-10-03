import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit3, Trash2, ArrowRight } from "lucide-react";
import type { Task, ColumnIdType } from "../../store/taskStore";

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, targetColumn: ColumnIdType) => void;
  onViewDetails: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMove,
  onViewDetails,
  onDragStart,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = task.dueDate && task.dueDate < todayStr && task.columnId !== "done";

  // Subtask counts
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  // Format date cleanly e.g. "Oct 08"
  const formattedDate = React.useMemo(() => {
    if (!task.dueDate) return null;
    try {
      const parts = task.dueDate.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      }
      return task.dueDate;
    } catch {
      return task.dueDate;
    }
  }, [task.dueDate]);

  // Priority indicator styles
  const priorityConfig = {
    urgent: { label: "Urgent", color: "text-[#C94B4B]", dot: "bg-[#C94B4B]" },
    high: { label: "High", color: "text-[#B9683E]", dot: "bg-[#B9683E]" },
    medium: { label: "Medium", color: "text-[#B7862D]", dot: "bg-[#B7862D]" },
    low: { label: "Low", color: "text-[#617278]", dot: "bg-[#617278]" },
  }[task.priority] || { label: task.priority, color: "text-[#617278]", dot: "bg-[#617278]" };

  // Next column determination for quick move
  const columnOrder: ColumnIdType[] = ["todo", "in_progress", "in_review", "done"];
  const currentColIndex = columnOrder.indexOf(task.columnId);
  const nextColumn = currentColIndex < columnOrder.length - 1 ? columnOrder[currentColIndex + 1] : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onViewDetails(task)}
      className="group bg-[#FFFCF6]/90 backdrop-blur-xs rounded-xl p-3.5 border border-[#D7D2C7] hover:border-[#B9683E]/45 shadow-[0_8px_24px_rgba(23,59,74,0.06)] hover:shadow-[0_12px_28px_rgba(23,59,74,0.10)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:cursor-grabbing select-none relative flex flex-col justify-between"
    >
      <div>
        {/* Top: Priority Dot/Label & 3-dot Menu */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={`w-2 h-2 rounded-full ${priorityConfig.dot}`} />
            <span className={priorityConfig.color}>{priorityConfig.label}</span>
          </div>

          {/* 3-dot Action Menu (Hover visible or active) */}
          <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE] opacity-60 group-hover:opacity-100 transition cursor-pointer"
              title="Card options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-[#FFFCF6] border border-[#D7D2C7] rounded-xl shadow-[0_16px_40px_rgba(23,59,74,0.12)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(task);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#18262B] hover:text-[#B9683E] hover:bg-[#ECE8DE] flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>

                {nextColumn && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onMove(task.id, nextColumn);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[#18262B] hover:text-[#B9683E] hover:bg-[#ECE8DE] flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 text-[#B9683E]" />
                    <span>Move Next</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete(task.id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#C94B4B] hover:bg-[#C94B4B]/10 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h3
          className={`font-semibold text-sm sm:text-base text-[#18262B] leading-snug line-clamp-2 hover:text-[#B9683E] transition mb-1.5 ${
            task.columnId === "done" ? "line-through text-[#617278]/60" : ""
          }`}
        >
          {task.title}
        </h3>

        {/* Short Description */}
        {task.description && (
          <p className="text-xs sm:text-sm text-[#617278] line-clamp-2 mb-3 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Due date on left, subtasks on right */}
      <div className="pt-2.5 border-t border-[#D7D2C7]/60 flex items-center justify-between text-xs text-[#617278] mt-1">
        {formattedDate ? (
          <span
            className={`font-medium ${
              isOverdue ? "text-[#C94B4B] font-semibold" : "text-[#617278]"
            }`}
          >
            {formattedDate} {isOverdue && "(overdue)"}
          </span>
        ) : (
          <span />
        )}

        {totalSubtasks > 0 && (
          <span className="text-xs text-[#617278] font-medium">
            {completedSubtasks}/{totalSubtasks} subtasks
          </span>
        )}
      </div>
    </div>
  );
};
