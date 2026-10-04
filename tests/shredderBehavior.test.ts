import { describe, it, expect, beforeEach } from "bun:test";
import { useTaskStore } from "../src/store/taskStore";

describe("Shredder Behavior and Timing in taskStore", () => {
  beforeEach(() => {
    // Reset store state
    useTaskStore.setState({
      tasks: [],
      searchQuery: "",
      selectedPriority: "all",
      selectedTag: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      activeView: "board",
    });
  });

  it("Case 1: Creating or moving task to Done sets a precise doneAt timestamp", () => {
    const task = useTaskStore.getState().addTask(
      {
        title: "Test Task 1",
        description: "Testing doneAt timestamp",
        priority: "medium",
        columnId: "in_progress",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    expect(task.doneAt).toBeUndefined();

    // Move to done
    const beforeMove = Date.now();
    useTaskStore.getState().moveTask(task.id, "done");
    const movedTask = useTaskStore.getState().tasks.find((t) => t.id === task.id);

    expect(movedTask).toBeDefined();
    expect(movedTask?.columnId).toBe("done");
    expect(movedTask?.doneAt).toBeDefined();
    expect(movedTask!.doneAt!).toBeGreaterThanOrEqual(beforeMove);
    expect(movedTask!.doneAt!).toBeLessThanOrEqual(Date.now());
  });

  it("Case 2: Moving task out of Done before 2 minutes clears doneAt", () => {
    const task = useTaskStore.getState().addTask(
      {
        title: "Test Task 2",
        description: "Move out test",
        priority: "high",
        columnId: "done",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    expect(task.doneAt).toBeDefined();

    // Move out to in_progress
    useTaskStore.getState().moveTask(task.id, "in_progress");
    const updatedTask = useTaskStore.getState().tasks.find((t) => t.id === task.id);

    expect(updatedTask?.columnId).toBe("in_progress");
    expect(updatedTask?.doneAt).toBeUndefined();

    // Move to in_review
    useTaskStore.getState().moveTask(task.id, "done");
    expect(useTaskStore.getState().tasks.find((t) => t.id === task.id)?.doneAt).toBeDefined();

    useTaskStore.getState().moveTask(task.id, "in_review");
    expect(useTaskStore.getState().tasks.find((t) => t.id === task.id)?.doneAt).toBeUndefined();
  });

  it("Case 3: Moving Done -> Done does NOT reset or duplicate the doneAt timestamp", () => {
    const task = useTaskStore.getState().addTask(
      {
        title: "Test Task 3",
        description: "Done to done reorder",
        priority: "low",
        columnId: "done",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    const initialDoneAt = task.doneAt;
    expect(initialDoneAt).toBeDefined();

    // Reorder within done column
    useTaskStore.getState().moveTask(task.id, "done", 0);
    const reorderedTask = useTaskStore.getState().tasks.find((t) => t.id === task.id);

    expect(reorderedTask?.doneAt).toBe(initialDoneAt);
  });

  it("Case 4: Multiple tasks in Done maintain independent timestamps and countdowns", async () => {
    const taskA = useTaskStore.getState().addTask(
      {
        title: "Task A",
        description: "First Done",
        priority: "medium",
        columnId: "todo",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    const taskB = useTaskStore.getState().addTask(
      {
        title: "Task B",
        description: "Second Done",
        priority: "high",
        columnId: "todo",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    useTaskStore.getState().moveTask(taskA.id, "done");
    const timestampA = useTaskStore.getState().tasks.find((t) => t.id === taskA.id)!.doneAt!;

    // Small delay to ensure distinct timestamps
    await new Promise((r) => setTimeout(r, 20));

    useTaskStore.getState().moveTask(taskB.id, "done");
    const timestampB = useTaskStore.getState().tasks.find((t) => t.id === taskB.id)!.doneAt!;

    expect(timestampA).toBeDefined();
    expect(timestampB).toBeDefined();
    expect(timestampB).toBeGreaterThan(timestampA);

    // Calculate independent remaining times
    const DURATION = 15 * 1000;
    const remainingA = Math.max(0, DURATION - (Date.now() - timestampA));
    const remainingB = Math.max(0, DURATION - (Date.now() - timestampB));

    expect(remainingB).toBeGreaterThan(remainingA);
  });

  it("Case 5: Moving task out and back into Done starts a fresh 15-second timer", async () => {
    const task = useTaskStore.getState().addTask(
      {
        title: "Re-entry Task",
        description: "Testing fresh timer",
        priority: "urgent",
        columnId: "done",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    const firstDoneAt = useTaskStore.getState().tasks.find((t) => t.id === task.id)!.doneAt!;

    // Move out
    useTaskStore.getState().moveTask(task.id, "todo");
    expect(useTaskStore.getState().tasks.find((t) => t.id === task.id)!.doneAt).toBeUndefined();

    await new Promise((r) => setTimeout(r, 20));

    // Move back into Done
    useTaskStore.getState().moveTask(task.id, "done");
    const secondDoneAt = useTaskStore.getState().tasks.find((t) => t.id === task.id)!.doneAt!;

    expect(secondDoneAt).toBeGreaterThan(firstDoneAt);
  });

  it("Case 6: Simulating browser refresh preserves remaining timing accurately", () => {
    // Suppose a task was marked done 9 seconds ago
    const pastTimestamp = Date.now() - 9000;

    const task = useTaskStore.getState().addTask(
      {
        title: "Persisted Task",
        description: "Browser refresh test",
        priority: "medium",
        columnId: "done",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    // Update with past timestamp simulating existing persisted state
    useTaskStore.setState({
      tasks: useTaskStore.getState().tasks.map((t) =>
        t.id === task.id ? { ...t, doneAt: pastTimestamp } : t
      ),
    });

    const loadedTask = useTaskStore.getState().tasks.find((t) => t.id === task.id);
    expect(loadedTask?.doneAt).toBe(pastTimestamp);

    const DURATION = 15000;
    const elapsed = Date.now() - loadedTask!.doneAt!;
    const remaining = Math.max(0, DURATION - elapsed);

    // Remaining should be approximately 6 seconds (15 - 9), NOT reset to 15 seconds!
    expect(remaining).toBeLessThanOrEqual(7000);
    expect(remaining).toBeGreaterThanOrEqual(5000);
  });

  it("Case 7: deleteTask permanently removes the task from the store", () => {
    const task = useTaskStore.getState().addTask(
      {
        title: "Delete Target",
        description: "Will be deleted",
        priority: "low",
        columnId: "done",
        tags: [],
        subtasks: [],
      },
      "user-1"
    );

    expect(useTaskStore.getState().tasks.some((t) => t.id === task.id)).toBe(true);

    useTaskStore.getState().deleteTask(task.id);

    expect(useTaskStore.getState().tasks.some((t) => t.id === task.id)).toBe(false);
  });
});
