import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { Task, ColumnIdType } from "../../store/taskStore";
import { COLUMNS } from "../../store/taskStore";
import { KanbanCard } from "./KanbanCard";

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
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.columnId === column.id);
        const isDragOver = activeDragCol === column.id;

        // Semantic dot color for column status indicator
        const dotColor =
          column.id === "todo"
            ? "bg-[#2D5B6B]"
            : column.id === "in_progress"
            ? "bg-[#B9683E]"
            : column.id === "in_review"
            ? "bg-[#B7862D]"
            : "bg-[#4F7D61]";

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex flex-col bg-[#FFFCF6]/60 backdrop-blur-md border rounded-2xl p-3.5 transition-all duration-200 min-h-[500px] ${
              isDragOver
                ? "border-[#B9683E] bg-[#FFFCF6]/85 shadow-md"
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
                <span className="text-xs font-semibold text-[#617278] bg-[#ECE8DE] px-2.5 py-0.5 rounded-full border border-[#D7D2C7]/80">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onOpenCreateModal(column.id)}
                title={`Add task to ${column.title}`}
                className="p-1.5 text-[#617278] hover:text-[#B9683E] hover:bg-[#ECE8DE] rounded-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Tasks Container */}
            <div className="flex flex-col gap-2.5 flex-1">
              {columnTasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onMove={onMoveTask}
                  onViewDetails={onViewDetails}
                  onDragStart={handleDragStart}
                />
              ))}

              {/* Minimal Empty State */}
              {columnTasks.length === 0 && (
                <div
                  onClick={() => onOpenCreateModal(column.id)}
                  className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center flex-1 min-h-[140px] ${
                    isDragOver
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
        );
      })}
    </div>
  );
};
