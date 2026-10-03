import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { 
  taskSchema, 
  type TaskFormData, 
  type ColumnIdType,
  type SubtaskType
} from "../../schemas/DashboardSchema";
import type { Task } from "../../store/taskStore";
import { COLUMNS, AVAILABLE_TAGS } from "../../store/taskStore";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task | null;
  defaultColumn?: ColumnIdType;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultColumn = "todo",
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasksList, setSubtasksList] = useState<SubtaskType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      columnId: defaultColumn,
      dueDate: "",
      tags: [],
      subtasks: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        priority: initialData.priority,
        columnId: initialData.columnId,
        dueDate: initialData.dueDate || "",
        tags: initialData.tags || [],
        subtasks: initialData.subtasks || [],
      });
      setSelectedTags(initialData.tags || []);
      setSubtasksList(initialData.subtasks || []);
      // Expand more options if task has existing tags or subtasks
      if ((initialData.tags && initialData.tags.length > 0) || (initialData.subtasks && initialData.subtasks.length > 0)) {
        setShowMoreOptions(true);
      } else {
        setShowMoreOptions(false);
      }
    } else {
      reset({
        title: "",
        description: "",
        priority: "medium",
        columnId: defaultColumn,
        dueDate: "",
        tags: [],
        subtasks: [],
      });
      setSelectedTags([]);
      setSubtasksList([]);
      setShowMoreOptions(false);
    }
  }, [initialData, defaultColumn, reset, isOpen]);

  if (!isOpen) return null;

  // Subtask handlers
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    const newSub: SubtaskType = {
      id: `sub-${crypto.randomUUID()}`,
      title: subtaskInput.trim(),
      completed: false,
    };
    const updated = [...subtasksList, newSub];
    setSubtasksList(updated);
    setValue("subtasks", updated);
    setSubtaskInput("");
  };

  const handleRemoveSubtask = (id: string) => {
    const updated = subtasksList.filter((s) => s.id !== id);
    setSubtasksList(updated);
    setValue("subtasks", updated);
  };

  // Tag handlers
  const handleToggleTag = (tag: string) => {
    const exists = selectedTags.includes(tag);
    const updated = exists ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    setSelectedTags(updated);
    setValue("tags", updated);
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customTagInput.trim()) {
      e.preventDefault();
      const cleanTag = customTagInput.trim().replace(/^#/, "");
      if (!selectedTags.includes(cleanTag)) {
        const updated = [...selectedTags, cleanTag];
        setSelectedTags(updated);
        setValue("tags", updated);
      }
      setCustomTagInput("");
    }
  };

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      ...data,
      tags: selectedTags,
      subtasks: subtasksList,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18262B]/35 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFCF6]/95 backdrop-blur-2xl rounded-2xl w-full max-w-lg shadow-[0_24px_80px_rgba(23,59,74,0.20)] border border-[#D7D2C7] overflow-hidden my-8 glass-panel relative animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D7D2C7]/70 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#18262B]">
            {initialData ? "Edit Task" : "New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE] rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 text-sm">
          {/* Primary Field 1: Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-bold text-[#617278] uppercase tracking-wider mb-1.5">
              Title <span className="text-[#C94B4B]">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              {...register("title")}
              className={`w-full px-3.5 py-2.5 bg-[#FFFCF6] border ${
                errors.title ? "border-[#C94B4B] bg-[#C94B4B]/5" : "border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20"
              } rounded-xl text-sm sm:text-base text-[#18262B] placeholder-[#617278]/60 focus:outline-none transition`}
            />
            {errors.title && (
              <p className="text-xs text-[#C94B4B] mt-1.5 font-medium flex items-center gap-1.5 bg-[#C94B4B]/5 p-1.5 rounded-lg border border-[#C94B4B]/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* Primary Field 2: Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-bold text-[#617278] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Add key context or details..."
              {...register("description")}
              className="w-full px-3.5 py-2.5 bg-[#FFFCF6] border border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20 rounded-xl text-sm sm:text-base text-[#18262B] placeholder-[#617278]/60 focus:outline-none transition"
            />
          </div>

          {/* Primary Field 3 & 4: Status and Priority */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="task-column" className="block text-xs font-bold text-[#617278] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                id="task-column"
                {...register("columnId")}
                className="w-full px-3 py-2 bg-[#FFFCF6] border border-[#D7D2C7] rounded-xl text-sm font-medium text-[#18262B] focus:border-[#B9683E] focus:outline-none cursor-pointer"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id} className="bg-[#FFFCF6] text-[#18262B]">
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="block text-xs font-bold text-[#617278] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                id="task-priority"
                {...register("priority")}
                className="w-full px-3 py-2 bg-[#FFFCF6] border border-[#D7D2C7] rounded-xl text-sm font-medium text-[#18262B] focus:border-[#B9683E] focus:outline-none cursor-pointer"
              >
                <option value="low" className="bg-[#FFFCF6] text-[#18262B]">Low</option>
                <option value="medium" className="bg-[#FFFCF6] text-[#18262B]">Medium</option>
                <option value="high" className="bg-[#FFFCF6] text-[#18262B]">High</option>
                <option value="urgent" className="bg-[#FFFCF6] text-[#18262B]">Urgent</option>
              </select>
            </div>
          </div>

          {/* Primary Field 5: Due Date */}
          <div>
            <label htmlFor="task-duedate" className="block text-xs font-bold text-[#617278] uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              id="task-duedate"
              type="date"
              {...register("dueDate")}
              className="w-full px-3.5 py-2 bg-[#FFFCF6] border border-[#D7D2C7] rounded-xl text-sm font-medium text-[#18262B] focus:border-[#B9683E] focus:outline-none transition"
            />
          </div>

          {/* Collapsible More Options Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="flex items-center gap-2 text-sm text-[#617278] hover:text-[#B9683E] transition cursor-pointer select-none font-semibold"
            >
              {showMoreOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showMoreOptions ? "Fewer options" : "More options (Tags, Checklist)"}</span>
              {(selectedTags.length > 0 || subtasksList.length > 0) && !showMoreOptions && (
                <span className="w-2 h-2 rounded-full bg-[#B9683E]" />
              )}
            </button>
          </div>

          {/* Expandable Advanced Fields */}
          {showMoreOptions && (
            <div className="space-y-4 pt-3 border-t border-[#D7D2C7]/60 animate-in fade-in duration-100">
              {/* Tags Manager */}
              <div>
                <label className="block text-xs font-bold text-[#617278] uppercase tracking-wider mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                          isSelected
                            ? "bg-[#B9683E] text-[#FFFCF6] font-semibold border-[#B9683E]"
                            : "bg-[#ECE8DE] text-[#617278] border-[#D7D2C7] hover:text-[#18262B]"
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  placeholder="Add custom tag & press Enter..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  className="w-full px-3 py-2 bg-[#FFFCF6] border border-[#D7D2C7] rounded-xl text-sm text-[#18262B] placeholder-[#617278]/60 focus:border-[#B9683E] focus:outline-none"
                />
              </div>

              {/* Subtasks Checklist */}
              <div>
                <label className="block text-xs font-bold text-[#617278] uppercase tracking-wider mb-2">
                  Checklist ({subtasksList.length})
                </label>
                <div className="flex gap-2 mb-2.5">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubtask(e);
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-[#FFFCF6] border border-[#D7D2C7] rounded-xl text-sm text-[#18262B] placeholder-[#617278]/60 focus:border-[#B9683E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3.5 py-2 bg-[#ECE8DE] hover:bg-[#D7D2C7] border border-[#D7D2C7] text-[#B9683E] font-semibold text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {subtasksList.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {subtasksList.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between gap-2 p-2 px-3 bg-[#ECE8DE]/50 rounded-lg border border-[#D7D2C7]/70 text-sm"
                      >
                        <span className="text-[#18262B] truncate">{sub.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(sub.id)}
                          className="text-[#617278] hover:text-[#C94B4B] p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#D7D2C7]/70 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#617278] hover:text-[#18262B] hover:bg-[#ECE8DE] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-[#FFFCF6] bg-[#B9683E] hover:bg-[#98502F] rounded-xl transition cursor-pointer shadow-[0_8px_20px_rgba(185,104,62,0.20)] active:translate-y-0"
            >
              {initialData ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
