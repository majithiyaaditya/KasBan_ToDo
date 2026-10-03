import React, { useState } from "react";
import {
  X,
  Calendar,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import type { Task, ColumnIdType } from "../../store/taskStore";
import { COLUMNS, useTaskStore } from "../../store/taskStore";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [newSubtask, setNewSubtask] = useState("");
  const { toggleSubtask, addSubtask, removeSubtask, moveTask } = useTaskStore();

  if (!isOpen || !task) return null;

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    addSubtask(task.id, newSubtask.trim());
    setNewSubtask("");
  };

  const priorityConfig = {
    urgent: { label: "Urgent", color: "text-[#C94B4B]", dot: "bg-[#C94B4B]" },
    high: { label: "High", color: "text-[#B9683E]", dot: "bg-[#B9683E]" },
    medium: { label: "Medium", color: "text-[#B7862D]", dot: "bg-[#B7862D]" },
    low: { label: "Low", color: "text-[#617278]", dot: "bg-[#617278]" },
  }[task.priority] || { label: task.priority, color: "text-[#617278]", dot: "bg-[#617278]" };

  const completedSubCount = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubCount = task.subtasks?.length || 0;
  const subPercent = totalSubCount > 0 ? Math.round((completedSubCount / totalSubCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18262B]/35 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFCF6]/95 backdrop-blur-2xl rounded-2xl w-full max-w-lg shadow-[0_20px_60px_rgba(23,59,74,0.18)] border border-[#D7D2C7] overflow-hidden my-8 glass-panel animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#D7D2C7]/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${priorityConfig.dot}`} />
            <span className={`text-sm font-bold ${priorityConfig.color}`}>
              {priorityConfig.label} Priority
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              title="Edit Task"
              className="p-1.5 text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE] rounded-lg transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              title="Delete Task"
              className="p-1.5 text-[#617278] hover:text-[#C94B4B] hover:bg-[#C94B4B]/10 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE] rounded-lg transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Status selector & Title */}
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-xs font-bold text-[#617278] uppercase tracking-wider">Status:</span>
              <select
                value={task.columnId}
                onChange={(e) => moveTask(task.id, e.target.value as ColumnIdType)}
                className="text-sm font-semibold px-3 py-1.5 rounded-xl border border-[#D7D2C7] bg-[#FFFCF6] text-[#18262B] focus:outline-none focus:border-[#B9683E] cursor-pointer"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id} className="bg-[#FFFCF6] text-[#18262B]">
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#18262B] leading-snug">
              {task.title}
            </h1>
          </div>

          {/* Description */}
          {task.description && (
            <div className="bg-[#ECE8DE]/40 p-4 rounded-xl border border-[#D7D2C7]/80">
              <p className="text-sm sm:text-base text-[#18262B] leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Metadata: Due Date & Tags */}
          <div className="flex flex-wrap items-center gap-4">
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-[#617278] font-medium">
                <Calendar className="w-4 h-4 text-[#B9683E]" />
                <span>Due {task.dueDate}</span>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#ECE8DE] text-[#617278] border border-[#D7D2C7]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Checklist / Subtasks */}
          <div className="pt-3 border-t border-[#D7D2C7]/70">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-[#18262B] uppercase tracking-wider text-xs sm:text-sm">
                Subtasks ({completedSubCount}/{totalSubCount})
              </span>
              {totalSubCount > 0 && (
                <span className="text-xs sm:text-sm text-[#B9683E] font-semibold">{subPercent}% done</span>
              )}
            </div>

            {totalSubCount > 0 && (
              <div className="w-full bg-[#ECE8DE] rounded-full h-2 mb-3 overflow-hidden border border-[#D7D2C7]/70">
                <div
                  className="bg-[#B9683E] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subPercent}%` }}
                />
              </div>
            )}

            {/* Subtask list */}
            <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto">
              {task.subtasks?.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-[#ECE8DE]/40 hover:bg-[#ECE8DE]/70 transition border border-[#D7D2C7]/60 text-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleSubtask(task.id, sub.id)}
                    className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                  >
                    {sub.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#4F7D61] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#617278] shrink-0" />
                    )}
                    <span
                      className={`${
                        sub.completed ? "line-through text-[#617278]/60" : "text-[#18262B] font-medium"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeSubtask(task.id, sub.id)}
                    className="text-[#617278] hover:text-[#C94B4B] p-1 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask */}
            <form onSubmit={handleAddSub} className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#FFFCF6] border border-[#D7D2C7] rounded-xl text-sm text-[#18262B] placeholder-[#617278]/60 focus:border-[#B9683E] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#B9683E] hover:bg-[#98502F] text-[#FFFCF6] font-semibold rounded-xl text-sm flex items-center gap-1.5 transition cursor-pointer shadow-[0_4px_12px_rgba(185,104,62,0.15)]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#ECE8DE]/40 border-t border-[#D7D2C7]/70 flex items-center justify-between text-xs sm:text-sm text-[#617278]">
          <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FFFCF6] hover:bg-[#ECE8DE] border border-[#D7D2C7] rounded-xl text-[#18262B] transition cursor-pointer font-semibold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
