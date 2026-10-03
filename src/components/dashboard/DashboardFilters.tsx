import React, { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useTaskStore, AVAILABLE_TAGS, type SortOption } from "../../store/taskStore";

export const DashboardFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    resetFilters,
  } = useTaskStore();

  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsFilterPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFilterCount =
    (selectedPriority !== "all" ? 1 : 0) +
    (selectedTag !== "all" ? 1 : 0) +
    (sortBy !== "createdAt" ? 1 : 0);

  const isFiltered = Boolean(searchQuery) || activeFilterCount > 0;

  return (
    <div className="relative mb-5 select-none" ref={popoverRef}>
      <div className="flex items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#617278] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#FFFCF6]/85 hover:bg-[#FFFCF6] focus:bg-[#FFFCF6] border border-[#D7D2C7] focus:border-[#B9683E] rounded-xl text-[#18262B] placeholder-[#617278]/60 focus:outline-none transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#617278] hover:text-[#18262B] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Toggle Button */}
        <button
          type="button"
          onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer shrink-0 shadow-2xs ${
            activeFilterCount > 0 || isFilterPopoverOpen
              ? "bg-[#B9683E]/10 text-[#B9683E] border-[#B9683E]/60 font-semibold"
              : "bg-[#FFFCF6]/85 text-[#617278] border-[#D7D2C7] hover:text-[#18262B] hover:bg-[#FFFCF6]"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#B9683E] text-[#FFFCF6] text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear quick button if filters active */}
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="px-2.5 py-2 text-xs text-[#617278] hover:text-[#18262B] transition cursor-pointer shrink-0"
            title="Reset all filters"
          >
            Clear
          </button>
        )}
      </div>

      {/* Compact Liquid Glass Filters Popover */}
      {isFilterPopoverOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#FFFCF6]/95 backdrop-blur-xl border border-[#D7D2C7] rounded-2xl shadow-xl p-4 z-40 animate-in fade-in zoom-in-95 duration-100 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#D7D2C7]/60">
            <span className="text-xs font-bold text-[#18262B] uppercase tracking-wider">
              Filter & Sort
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-[#B9683E] hover:underline font-medium cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#617278] mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: "all", label: "All" },
                { value: "urgent", label: "Urgent" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSelectedPriority(p.value)}
                  className={`py-1 text-xs rounded-lg border transition cursor-pointer ${
                    selectedPriority === p.value
                      ? "bg-[#B9683E] text-[#FFFCF6] font-semibold border-[#B9683E]"
                      : "bg-[#ECE8DE] text-[#617278] border-[#D7D2C7]/70 hover:text-[#18262B]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#617278] mb-1.5">
              Tag
            </label>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={`px-2 py-0.5 text-xs rounded-md border transition cursor-pointer ${
                  selectedTag === "all"
                    ? "bg-[#B9683E] text-[#FFFCF6] font-semibold border-[#B9683E]"
                    : "bg-[#ECE8DE] text-[#617278] border-[#D7D2C7]/70 hover:text-[#18262B]"
                }`}
              >
                All
              </button>
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-0.5 text-xs rounded-md border transition cursor-pointer ${
                    selectedTag === tag
                      ? "bg-[#B9683E] text-[#FFFCF6] font-semibold border-[#B9683E]"
                      : "bg-[#ECE8DE] text-[#617278] border-[#D7D2C7]/70 hover:text-[#18262B]"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By & Order */}
          <div>
            <label className="block text-[11px] font-semibold text-[#617278] mb-1.5">
              Sort By
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 bg-[#ECE8DE] text-xs text-[#18262B] rounded-lg px-2.5 py-1.5 border border-[#D7D2C7] focus:outline-none focus:border-[#B9683E] cursor-pointer"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title (A-Z)</option>
              </select>

              <button
                type="button"
                onClick={toggleSortOrder}
                title={`Order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
                className="p-1.5 bg-[#ECE8DE] hover:bg-[#D7D2C7] border border-[#D7D2C7] rounded-lg text-[#B9683E] transition cursor-pointer flex items-center gap-1 text-xs"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px] font-bold">{sortOrder}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
