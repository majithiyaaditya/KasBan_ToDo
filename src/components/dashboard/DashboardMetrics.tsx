import React from "react";
import type { Task } from "../../store/taskStore";

interface DashboardMetricsProps {
  tasks: Task[];
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.columnId === "in_progress").length;
  const inReviewTasks = tasks.filter((t) => t.columnId === "in_review").length;
  const completedTasks = tasks.filter((t) => t.columnId === "done").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const overdueTasks = tasks.filter(
    (t) => t.columnId !== "done" && t.dueDate && t.dueDate < todayStr
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFCF6]/85 backdrop-blur-md border border-[#D7D2C7]/80 rounded-2xl px-5 py-3.5 mb-6 text-sm select-none shadow-xs">
      {/* Metrics Summary Row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[#617278]">
        <div className="flex items-center gap-2">
          <span className="text-[#18262B] font-bold text-base sm:text-lg">{totalTasks}</span>
          <span className="font-medium text-xs sm:text-sm">Total</span>
        </div>

        <span className="text-[#D7D2C7] hidden sm:inline">·</span>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B9683E]" />
          <span className="text-[#18262B] font-bold text-base sm:text-lg">{inProgressTasks}</span>
          <span className="font-medium text-xs sm:text-sm">In Progress</span>
        </div>

        {inReviewTasks > 0 && (
          <>
            <span className="text-[#D7D2C7] hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B7862D]" />
              <span className="text-[#18262B] font-bold text-base sm:text-lg">{inReviewTasks}</span>
              <span className="font-medium text-xs sm:text-sm">Review</span>
            </div>
          </>
        )}

        <span className="text-[#D7D2C7] hidden sm:inline">·</span>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4F7D61]" />
          <span className="text-[#18262B] font-bold text-base sm:text-lg">{completedTasks}</span>
          <span className="font-medium text-xs sm:text-sm">Completed</span>
        </div>

        {overdueTasks > 0 && (
          <>
            <span className="text-[#D7D2C7] hidden sm:inline">·</span>
            <div className="flex items-center gap-2 text-[#C94B4B]">
              <span className="w-2 h-2 rounded-full bg-[#C94B4B] animate-pulse" />
              <span className="font-bold text-base sm:text-lg">{overdueTasks}</span>
              <span className="font-medium text-xs sm:text-sm">Overdue</span>
            </div>
          </>
        )}
      </div>

      {/* Compact Progress Indicator */}
      <div className="flex items-center gap-3 text-[#617278]">
        <span className="text-xs sm:text-sm font-semibold text-[#18262B]">{completionRate}% Done</span>
        <div className="w-20 sm:w-28 bg-[#ECE8DE] rounded-full h-2 overflow-hidden border border-[#D7D2C7]/60">
          <div
            className="bg-[#B9683E] h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
