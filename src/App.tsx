import { useEffect, useState } from "react";
import "./App.css";

type SectionKey = "taskList" | "tasks" | "completedTasks";

type SortBy = "date" | "priority";

type Task = {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  completed: boolean;
};

type TaskInput = Omit<Task, "id" | "completed">;

type OpenSection = {
  taskList: boolean;
  tasks: boolean;
  completedTasks: boolean;
};

type SectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

type TaskFormProps = {
  addTask: (task: TaskInput) => void;
};

type TaskCardProps = {
  task: Task;
  onComplete?: (id: number) => void;
  onDelete?: (id: number) => void;
};

type TasksListProps = {
  tasks: Task[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
};

type CompletedTasksProps = {
  tasks: Task[];
  onDelete: (id: number) => void;
};

const STORAGE_KEY = "tasks";

const loadFromStorage = (key: string): Task[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const Section = ({ title, isOpen, onToggle, children }: SectionProps) => (
  <div className="section">
    <div className="section-header">
      <h2>{title}</h2>
      <button className="toggle-btn" onClick={onToggle}>
        {isOpen ? "−" : "+"}
      </button>
    </div>
    {isOpen && <div className="section-body">{children}</div>}
  </div>
);

const TaskForm = ({ addTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("High");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), priority, dueDate });
    setTitle("");
    setPriority("High");
    setDueDate("");
  };

  return (
    <>
      <input
        className="input"
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="input"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task["priority"])}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        className="input"
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={handleSubmit} className="btn btn-primary">
        Add task
      </button>
    </>
  );
};

const TaskCard = ({ task, onComplete, onDelete }: TaskCardProps) => (
  <div className="task-card">
    <div className="task-info">
      <p className="task-title">{task.title}</p>
      <p className="task-date">
        {task.priority} • Due: {task.dueDate || "—"}
      </p>
    </div>
    <div className="task-actions">
      {onComplete && (
        <button
          className="btn btn-complete"
          onClick={() => onComplete(task.id)}
        >
          Complete
        </button>
      )}

      {onDelete && (
        <button className="btn btn-delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      )}
    </div>
  </div>
);
const TasksList = ({
  tasks,
  onComplete,
  onDelete,
  sortBy,
  onSortChange,
}: TasksListProps) => {
  const priorityOrder: Record<Task["priority"], number> = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const getTime = (date: string) => {
    if (!date) return Infinity;
    return new Date(date).getTime();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (diff !== 0) return diff;
      return getTime(a.dueDate) - getTime(b.dueDate);
    }
    return getTime(a.dueDate) - getTime(b.dueDate);
  });

  return (
    <>
      <div className="sort-controls">
        <button
          className={`btn btn-sort ${sortBy === "date" ? "active" : ""}`}
          onClick={() => onSortChange("date")}
        >
          By Date
        </button>
        <button
          className={`btn btn-sort ${sortBy === "priority" ? "active" : ""}`}
          onClick={() => onSortChange("priority")}
        >
          By Priority
        </button>
      </div>

      {sortedTasks.length === 0 ? (
        <p className="empty">No tasks yet</p>
      ) : (
        sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))
      )}
    </>
  );
};

const CompletedTasks = ({ tasks, onDelete }: CompletedTasksProps) => (
  <>
    {tasks.length === 0 ? (
      <p className="empty">No completed tasks</p>
    ) : (
      tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} />
      ))
    )}
  </>
);

function App() {
  const [openSection, setOpenSection] = useState<OpenSection>({
    taskList: false,
    tasks: true,
    completedTasks: true,
  });

  const [sortBy, setSortBy] = useState<SortBy>("date");

  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage(STORAGE_KEY),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const toggleSection = (section: SectionKey) => {
    setOpenSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addTask = (data: TaskInput) => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), completed: false, ...data },
    ]);
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedList = tasks.filter((t) => t.completed);

  const completeTask = (id: number) => {
    setTasks((prev) =>
      prev.map((el) => (el.id === id ? { ...el, completed: true } : el)),
    );
  };

  return (
    <div className="app">
      <Section
        title="Task List with Priority"
        isOpen={openSection.taskList}
        onToggle={() => toggleSection("taskList")}
      >
        <TaskForm addTask={addTask} />
      </Section>

      <Section
        title="Tasks"
        isOpen={openSection.tasks}
        onToggle={() => toggleSection("tasks")}
      >
        <TasksList
          tasks={activeTasks}
          onComplete={completeTask}
          onDelete={deleteTask}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </Section>

      <Section
        title="Completed Task"
        isOpen={openSection.completedTasks}
        onToggle={() => toggleSection("completedTasks")}
      >
        <CompletedTasks tasks={completedList} onDelete={deleteTask} />
      </Section>
    </div>
  );
}
export default App;
