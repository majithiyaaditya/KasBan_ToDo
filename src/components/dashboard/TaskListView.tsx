import React from "react";
import {
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  Clock,
} from "lucide-react";
import type { Task, ColumnIdType } from "../../store/taskStore";
import { COLUMNS } from "../../store/taskStore";

interface TaskListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, targetColumn: ColumnIdType) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onViewDetails,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const handleToggleComplete = (task: Task) => {
    const nextCol = task.columnId === "done" ? "todo" : "done";
    onMoveTask(task.id, nextCol);
  };

  const priorityConfig = {
    urgent: { label: "Urgent", color: "text-[#C94B4B]", dot: "bg-[#C94B4B]" },
    high: { label: "High", color: "text-[#B9683E]", dot: "bg-[#B9683E]" },
    medium: { label: "Medium", color: "text-[#B7862D]", dot: "bg-[#B7862D]" },
    low: { label: "Low", color: "text-[#617278]", dot: "bg-[#617278]" },
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-[#FFFCF6]/80 backdrop-blur-md rounded-2xl border border-[#D7D2C7]/80 p-12 text-center select-none shadow-[0_4px_16px_rgba(23,59,74,0.03)]">
        <Clock className="w-10 h-10 text-[#617278]/40 mx-auto mb-3" />
        <p className="text-sm font-medium text-[#617278]">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFCF6]/85 backdrop-blur-md rounded-2xl border border-[#D7D2C7]/80 overflow-hidden select-none shadow-[0_4px_16px_rgba(23,59,74,0.03)]">
      <div className="divide-y divide-[#D7D2C7]/60">
        {tasks.map((task) => {
          const isDone = task.columnId === "done";
          const isOverdue = task.dueDate && task.dueDate < todayStr && !isDone;
          const prio = priorityConfig[task.priority] || priorityConfig.medium;

          return (
            <div
              key={task.id}
              className={`p-4 hover:bg-[#ECE8DE]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone ? "opacity-60 bg-[#ECE8DE]/20" : ""
              }`}
            >
              {/* Checkbox & Title */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(task)}
                  className="text-[#617278] hover:text-[#4F7D61] transition cursor-pointer shrink-0"
                >
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-[#4F7D61]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#617278]" />
                  )}
                </button>

                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span
                    onClick={() => onViewDetails(task)}
                    className={`font-semibold text-sm sm:text-base cursor-pointer hover:text-[#B9683E] transition truncate ${
                      isDone ? "line-through text-[#617278]/50" : "text-[#18262B]"
                    }`}
                  >
                    {task.title}
                  </span>

                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${prio.color}`}>
                    <span className={`w-2 h-2 rounded-full ${prio.dot}`} />
                    <span>{prio.label}</span>
                  </span>
                </div>
              </div>

              {/* Status & Date & Actions */}
              <div className="flex items-center gap-3 pl-8 sm:pl-0 shrink-0">
                {/* Column stage */}
                <select
                  value={task.columnId}
                  onChange={(e) => onMoveTask(task.id, e.target.value as ColumnIdType)}
                  className="text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg border border-[#D7D2C7] bg-[#FFFCF6] text-[#18262B] cursor-pointer focus:outline-none focus:border-[#B9683E]"
                >
                  {COLUMNS.map((col) => (
                    <option key={col.id} value={col.id} className="bg-[#FFFCF6] text-[#18262B]">
                      {col.title}
                    </option>
                  ))}
                </select>

                {/* Due Date */}
                {task.dueDate && (
                  <span
                    className={`text-xs sm:text-sm font-medium shrink-0 ${
                      isOverdue ? "text-[#C94B4B] font-bold" : "text-[#617278]"
                    }`}
                  >
                    {task.dueDate}
                  </span>
                )}

                {/* Actions */}
                <button
                  type="button"
                  onClick={() => onEditTask(task)}
                  title="Edit task"
                  className="p-1.5 text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE] rounded-md transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete task"
                  className="p-1.5 text-[#617278] hover:text-[#C94B4B] hover:bg-[#C94B4B]/15 rounded-md transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
