import React from "react";
import { Layers, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Task } from "../../store/taskStore";
import { AnimatedCounter } from "../interactions";
import { AnimatedItem } from "../AnimatedList";

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
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFCF6]/85 backdrop-blur-md border border-[#D7D2C7]/80 rounded-2xl p-2.5 sm:px-5 sm:py-3 mb-6 select-none shadow-xs">
      {/* Metrics Row: Highlighted Total & In Progress + Secondary Statuses */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Highlighted Metric: Total Tasks (Deep Ocean Slate Palette) */}
        <AnimatedItem index={0} delay={0.03} duration={0.55} scale={0.92} y={10}>
          <div
            className="group flex items-center gap-2.5 bg-gradient-to-r from-[#173B4A]/10 via-[#173B4A]/[0.06] to-[#2D5B6B]/10 hover:from-[#173B4A]/15 hover:to-[#2D5B6B]/15 border border-[#173B4A]/25 hover:border-[#173B4A]/40 rounded-xl px-3.5 py-1.5 transition-all duration-200 shadow-[0_2px_8px_rgba(23,59,74,0.05)] hover:shadow-xs hover:-translate-y-0.5 cursor-default"
            title="Total tasks in workspace"
          >
            <div className="w-6 h-6 rounded-lg bg-[#173B4A] text-[#FFFCF6] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#173B4A] font-extrabold text-base sm:text-lg tracking-tight">
                <AnimatedCounter value={totalTasks} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2D5B6B]">
                Total
              </span>
            </div>
          </div>
        </AnimatedItem>

        {/* Highlighted Metric: In Progress (Signature Terracotta Copper Palette) */}
        <AnimatedItem index={1} delay={0.08} duration={0.55} scale={0.92} y={10}>
          <div
            className="group flex items-center gap-2.5 bg-gradient-to-r from-[#B9683E]/14 via-[#B9683E]/[0.08] to-[#98502F]/12 hover:from-[#B9683E]/20 hover:to-[#98502F]/16 border border-[#B9683E]/35 hover:border-[#B9683E]/55 rounded-xl px-3.5 py-1.5 transition-all duration-200 shadow-[0_2px_10px_rgba(185,104,62,0.10)] hover:shadow-xs hover:-translate-y-0.5 cursor-default relative overflow-hidden"
            title="Tasks currently in progress"
          >
            <div className="w-6 h-6 rounded-lg bg-[#B9683E] text-[#FFFCF6] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-200">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#B9683E] font-extrabold text-base sm:text-lg tracking-tight">
                <AnimatedCounter value={inProgressTasks} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#98502F] flex items-center gap-1.5">
                <span>In Progress</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9683E] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B9683E]" />
                </span>
              </span>
            </div>
          </div>
        </AnimatedItem>

        {/* Secondary Metric: In Review (if any) */}
        {inReviewTasks > 0 && (
          <AnimatedItem index={2} delay={0.13} duration={0.55} scale={0.92} y={10}>
            <div
              className="flex items-center gap-2 bg-[#B7862D]/10 hover:bg-[#B7862D]/15 border border-[#B7862D]/25 hover:border-[#B7862D]/40 rounded-xl px-3 py-1.5 transition duration-150 cursor-default"
              title="Tasks awaiting review"
            >
              <span className="w-2 h-2 rounded-full bg-[#B7862D]" />
              <span className="text-[#B7862D] font-bold text-sm sm:text-base">
                <AnimatedCounter value={inReviewTasks} />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#8C641D]">
                Review
              </span>
            </div>
          </AnimatedItem>
        )}

        {/* Secondary Metric: Completed */}
        <AnimatedItem index={3} delay={0.18} duration={0.55} scale={0.92} y={10}>
          <div
            className="flex items-center gap-2 bg-[#4F7D61]/10 hover:bg-[#4F7D61]/15 border border-[#4F7D61]/25 hover:border-[#4F7D61]/40 rounded-xl px-3 py-1.5 transition duration-150 cursor-default"
            title="Completed tasks"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7D61]" />
            <span className="text-[#4F7D61] font-bold text-sm sm:text-base">
              <AnimatedCounter value={completedTasks} />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#3B664C]">
              Completed
            </span>
          </div>
        </AnimatedItem>

        {/* Secondary Metric: Overdue (if any) */}
        {overdueTasks > 0 && (
          <AnimatedItem index={4} delay={0.23} duration={0.55} scale={0.92} y={10}>
            <div
              className="flex items-center gap-2 bg-[#C94B4B]/12 hover:bg-[#C94B4B]/18 border border-[#C94B4B]/35 hover:border-[#C94B4B]/50 rounded-xl px-3 py-1.5 text-[#C94B4B] transition duration-150 cursor-default"
              title="Overdue tasks"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#C94B4B] animate-pulse" />
              <span className="font-bold text-sm sm:text-base">
                <AnimatedCounter value={overdueTasks} />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A83737]">
                Overdue
              </span>
            </div>
          </AnimatedItem>
        )}
      </div>

      {/* Progress Indicator */}
      <AnimatedItem index={5} delay={0.28} duration={0.55} scale={0.92} y={10}>
        <div className="flex items-center gap-3 bg-[#ECE8DE]/70 backdrop-blur-xs border border-[#D7D2C7] rounded-xl px-3.5 py-1.5 shadow-2xs">
          <span className="text-xs sm:text-sm font-extrabold text-[#173B4A]">
            <AnimatedCounter value={completionRate} suffix="% Done" />
          </span>
          <div className="w-20 sm:w-28 bg-[#D7D2C7]/70 rounded-full h-2.5 overflow-hidden p-[1px]">
            <div
              className="bg-gradient-to-r from-[#B9683E] via-[#C47A44] to-[#98502F] h-full rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </AnimatedItem>
    </div>
  );
};

