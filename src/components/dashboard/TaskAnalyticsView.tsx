import React from "react";
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  CheckSquare
} from "lucide-react";
import type { Task } from "../../store/taskStore";
import { COLUMNS } from "../../store/taskStore";
import { AnimatedItem } from "../AnimatedList";

interface TaskAnalyticsViewProps {
  tasks: Task[];
  onViewDetails: (task: Task) => void;
}

export const TaskAnalyticsView: React.FC<TaskAnalyticsViewProps> = ({ tasks, onViewDetails }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.columnId === "done").length;
  const inProgressTasks = tasks.filter((t) => t.columnId === "in_progress").length;
  const inReviewTasks = tasks.filter((t) => t.columnId === "in_review").length;
  const todoTasks = tasks.filter((t) => t.columnId === "todo").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const overdueTasksList = tasks.filter(
    (t) => t.columnId !== "done" && t.dueDate && t.dueDate < todayStr
  );

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority counts
  const priorityCounts = {
    urgent: tasks.filter((t) => t.priority === "urgent").length,
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  };

  // Subtask totals
  let totalSubtasks = 0;
  let completedSubtasks = 0;
  tasks.forEach((t) => {
    if (t.subtasks) {
      totalSubtasks += t.subtasks.length;
      completedSubtasks += t.subtasks.filter((s) => s.completed).length;
    }
  });

  const subtaskRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="space-y-5 select-none">
      {/* Top Banner Analytics */}
      <AnimatedItem index={0} delay={0.04} duration={0.65} scale={0.96} y={16}>
        <div className="bg-[#FFFCF6]/85 backdrop-blur-md border border-[#D7D2C7]/80 rounded-2xl p-6 sm:p-7 text-[#18262B] shadow-[0_4px_16px_rgba(23,59,74,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ECE8DE] text-xs font-bold text-[#B9683E] mb-2.5 border border-[#D7D2C7]">
                <TrendingUp className="w-4 h-4 text-[#B9683E]" />
                Productivity Overview
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18262B]">
                Workspace Analytics
              </h2>
              <p className="text-[#617278] text-sm sm:text-base mt-1.5">
                Real-time workflow throughput, stage velocity, and delivery health.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-[#ECE8DE]/60 px-5 py-3.5 rounded-2xl border border-[#D7D2C7] self-start sm:self-auto">
              <div>
                <p className="text-xs font-bold text-[#617278] uppercase tracking-wider">Completion Rate</p>
                <p className="text-3xl font-extrabold text-[#B9683E]">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#B9683E] flex items-center justify-center font-bold text-sm text-[#18262B] bg-[#FFFCF6]">
                {completedTasks}/{totalTasks}
              </div>
            </div>
          </div>
        </div>
      </AnimatedItem>

      {/* Grid: Workflow stage breakdown & Priority distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Stage distribution */}
        <AnimatedItem index={1} delay={0.10} duration={0.65} scale={0.95} y={16} className="h-full">
          <div className="bg-[#FFFCF6]/85 backdrop-blur-md rounded-2xl border border-[#D7D2C7]/80 p-6 shadow-[0_4px_16px_rgba(23,59,74,0.03)] h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#18262B] text-sm sm:text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B9683E]" />
                Workflow Stages
              </h3>
              <span className="text-xs sm:text-sm font-bold text-[#173B4A] bg-[#173B4A]/10 border border-[#173B4A]/25 px-2.5 py-1 rounded-xl shadow-2xs">
                {totalTasks} Total Tasks
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { label: "To Do", count: todoTasks, fill: "bg-[#2D5B6B]" },
                { label: "In Progress", count: inProgressTasks, fill: "bg-[#B9683E]" },
                { label: "In Review", count: inReviewTasks, fill: "bg-[#B7862D]" },
                { label: "Done", count: completedTasks, fill: "bg-[#4F7D61]" },
              ].map((col) => {
                const pct = totalTasks > 0 ? Math.round((col.count / totalTasks) * 100) : 0;
                return (
                  <div key={col.label}>
                    <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                      <span className="text-[#18262B]">{col.label}</span>
                      <span className="text-[#617278]">
                        {col.count} tasks ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#ECE8DE] rounded-full h-2 overflow-hidden border border-[#D7D2C7]/70">
                      <div
                        className={`h-2 rounded-full ${col.fill} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedItem>

        {/* Priority breakdown & Checklist progress */}
        <AnimatedItem index={2} delay={0.16} duration={0.65} scale={0.95} y={16} className="h-full">
          <div className="bg-[#FFFCF6]/85 backdrop-blur-md rounded-2xl border border-[#D7D2C7]/80 p-6 flex flex-col justify-between gap-5 shadow-[0_4px_16px_rgba(23,59,74,0.03)] h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#18262B] text-sm sm:text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#B9683E]" />
                  Priority Breakdown
                </h3>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <div className="bg-[#C94B4B]/5 border border-[#C94B4B]/20 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-[#C94B4B] uppercase">Urgent</p>
                  <p className="text-2xl font-extrabold text-[#C94B4B] mt-0.5">{priorityCounts.urgent}</p>
                </div>
                <div className="bg-[#B9683E]/5 border border-[#B9683E]/20 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-[#B9683E] uppercase">High</p>
                  <p className="text-2xl font-extrabold text-[#B9683E] mt-0.5">{priorityCounts.high}</p>
                </div>
                <div className="bg-[#B7862D]/5 border border-[#B7862D]/20 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-[#B7862D] uppercase">Medium</p>
                  <p className="text-2xl font-extrabold text-[#B7862D] mt-0.5">{priorityCounts.medium}</p>
                </div>
                <div className="bg-[#ECE8DE]/50 border border-[#D7D2C7] rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-[#617278] uppercase">Low</p>
                  <p className="text-2xl font-extrabold text-[#18262B] mt-0.5">{priorityCounts.low}</p>
                </div>
              </div>
            </div>

            {/* Subtasks Rate */}
            <div className="bg-[#ECE8DE]/50 rounded-xl p-3.5 border border-[#D7D2C7]">
              <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
                <span className="text-[#18262B] flex items-center gap-2 font-semibold">
                  <CheckSquare className="w-4 h-4 text-[#B9683E]" />
                  Checklist Completion
                </span>
                <span className="font-bold text-[#B9683E]">
                  {completedSubtasks}/{totalSubtasks} ({subtaskRate}%)
                </span>
              </div>
              <div className="w-full bg-[#ECE8DE] rounded-full h-2 overflow-hidden border border-[#D7D2C7]/70">
                <div
                  className="bg-[#B9683E] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subtaskRate}%` }}
                />
              </div>
            </div>
          </div>
        </AnimatedItem>
      </div>

      {/* Overdue Tasks Section */}
      <AnimatedItem index={3} delay={0.22} duration={0.65} scale={0.96} y={16}>
        <div className="bg-[#FFFCF6]/85 backdrop-blur-md rounded-2xl border border-[#D7D2C7]/80 p-6 shadow-[0_4px_16px_rgba(23,59,74,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#18262B] text-sm sm:text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C94B4B]" />
              Overdue Tasks
            </h3>
            <span className="text-xs sm:text-sm font-bold text-[#C94B4B]">
              {overdueTasksList.length} requiring attention
            </span>
          </div>

          {overdueTasksList.length > 0 ? (
            <div className="divide-y divide-[#D7D2C7]/60">
              {overdueTasksList.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onViewDetails(task)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-[#ECE8DE]/40 px-3 rounded-xl transition cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#C94B4B]" />
                    <div>
                      <span className="font-semibold text-[#18262B]">{task.title}</span>
                      <span className="text-[#C94B4B] ml-2 font-bold">
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#617278] bg-[#ECE8DE] px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#D7D2C7]">
                    {COLUMNS.find((c) => c.id === task.columnId)?.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-[#4F7D61] text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#4F7D61]" />
              <span>All tasks are currently on schedule.</span>
            </div>
          )}
        </div>
      </AnimatedItem>
    </div>
  );
};
