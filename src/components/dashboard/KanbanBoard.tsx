import React, { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import type { Task, ColumnIdType } from "../../store/taskStore";
import { COLUMNS } from "../../store/taskStore";
import { KanbanCard } from "./KanbanCard";
import { MagneticButton } from "../interactions";
import { AnimatedItem } from "../AnimatedList";


interface KanbanBoardProps {
  tasks: Task[];
  onOpenCreateModal: (defaultColumn?: ColumnIdType) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, targetColumn: ColumnIdType) => void;
  onViewDetails: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onOpenCreateModal,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onViewDetails,
}) => {
  const [activeDragCol, setActiveDragCol] = useState<ColumnIdType | null>(null);
  const [boardError, setBoardError] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: ColumnIdType) => {
    e.preventDefault();
    if (activeDragCol !== columnId) {
      setActiveDragCol(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setActiveDragCol(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: ColumnIdType) => {
    e.preventDefault();
    setActiveDragCol(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onMoveTask(taskId, columnId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 items-start">
      {boardError && (
        <div className="col-span-full mb-1 p-3.5 bg-[#C94B4B]/10 border border-[#C94B4B]/30 text-[#C94B4B] rounded-xl text-sm flex items-center justify-between font-medium">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#C94B4B] shrink-0" />
            <span>{boardError}</span>
          </div>
          <button
            type="button"
            onClick={() => setBoardError(null)}
            className="text-xs text-[#C94B4B] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
      {COLUMNS.map((column, colIndex) => {
        const columnTasks = tasks.filter((t) => t.columnId === column.id);
        const isDragOver = activeDragCol === column.id;

        // Semantic styling for column badges & status indicators
        const dotColor =
          column.id === "todo"
            ? "bg-[#2D5B6B]"
            : column.id === "in_progress"
              ? "bg-[#B9683E]"
              : column.id === "in_review"
                ? "bg-[#B7862D]"
                : "bg-[#4F7D61]";

        const columnBadgeStyle =
          column.id === "in_progress"
            ? "bg-[#B9683E]/15 text-[#B9683E] border-[#B9683E]/35 font-bold shadow-2xs"
            : column.id === "todo"
              ? "bg-[#173B4A]/10 text-[#173B4A] border-[#173B4A]/25 font-bold shadow-2xs"
              : column.id === "in_review"
                ? "bg-[#B7862D]/15 text-[#B7862D] border-[#B7862D]/35 font-bold shadow-2xs"
                : "bg-[#4F7D61]/15 text-[#4F7D61] border-[#4F7D61]/35 font-bold shadow-2xs";

        return (
          <AnimatedItem
            key={column.id}
            index={colIndex}
            delay={colIndex * 0.08}
            duration={0.65}
            scale={0.94}
            y={18}
            className="h-full"
          >
            <div
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col bg-[#FFFCF6]/60 backdrop-blur-md border rounded-2xl p-3.5 transition-all duration-300 min-h-[500px] h-full ${isDragOver
                ? "border-[#B9683E] ring-2 ring-[#B9683E]/20 bg-[#FFFCF6]/90 shadow-[0_12px_32px_rgba(185,104,62,0.12)] -translate-y-0.5"
                : "border-[#D7D2C7]/80 shadow-[0_4px_16px_rgba(23,59,74,0.03)]"
                }`}
            >
              {/* Column Header: Simple indicator, Title, count, + button */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#D7D2C7]/70 select-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  <h2 className="font-bold text-sm sm:text-base text-[#18262B]">
                    {column.title}
                  </h2>
                  {column.id === "in_progress" && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9683E] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B9683E]" />
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${columnBadgeStyle}`}>
                    {columnTasks.length}
                  </span>
                </div>

                <MagneticButton
                  type="button"
                  onClick={() => onOpenCreateModal(column.id)}
                  title={`Add task to ${column.title}`}
                  className="p-1.5 text-[#617278] hover:text-[#B9683E] hover:bg-[#ECE8DE] rounded-md transition cursor-pointer"
                  strength={0.25}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </MagneticButton>
              </div>

              {/* Tasks Container with AnimatedList Card Flow */}
              <div className="flex flex-col gap-2.5 flex-1">
                {columnTasks.map((task, taskIndex) => (
                  <AnimatedItem
                    key={task.id}
                    index={taskIndex}
                    delay={Math.min((taskIndex % 6) * 0.04, 0.2)}
                    amount={0.15}
                    className="w-full"
                  >
                    <KanbanCard
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onMove={onMoveTask}
                      onViewDetails={onViewDetails}
                      onDragStart={handleDragStart}
                    />
                  </AnimatedItem>
                ))}

                {/* Minimal Empty State */}
                {columnTasks.length === 0 && (
                  <div
                    onClick={() => onOpenCreateModal(column.id)}
                    className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center flex-1 min-h-[140px] ${isDragOver
                      ? "border-[#B9683E] bg-[#B9683E]/5"
                      : "border-[#D7D2C7] hover:border-[#B9683E]/50 hover:bg-[#ECE8DE]/30"
                      }`}
                  >
                    <p className="text-sm font-medium text-[#617278]">No tasks</p>
                    <span className="text-sm text-[#B9683E] mt-1 font-semibold hover:underline">
                      + Add task
                    </span>
                  </div>
                )}
              </div>
            </div>
          </AnimatedItem>
        );
      })}
    </div>
  );
};
