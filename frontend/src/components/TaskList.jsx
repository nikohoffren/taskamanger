import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../api/client";

export default function TaskList({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    deadline: "",
  });

  const loadTasks = useCallback(async () => {
    try {
      const data = await apiRequest("tasks/", "GET", null, token, onLogout);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }, [token, onLogout]);

  useEffect(() => {
    if (token) loadTasks();
  }, [token, loadTasks]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const endpoint = editingTask ? `tasks/${editingTask.id}/` : "tasks/";
    const method = editingTask ? "PUT" : "POST";

    try {
      await apiRequest(endpoint, method, form, token, onLogout);
      setForm({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        deadline: "",
      });
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await apiRequest(`tasks/${id}/`, "DELETE", null, token, onLogout);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline,
    });
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("fi-FI", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="task-list-container">
      <h2 className="form-title">{editingTask ? "Edit Task" : "Add Task"}</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="form-input"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="form-textarea"
        />

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="form-input"
              lang="fi"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="form-button form-button-primary">
            {editingTask ? "Update Task" : "Add Task"}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setForm({
                  title: "",
                  description: "",
                  status: "TODO",
                  priority: "MEDIUM",
                  deadline: "",
                });
              }}
              className="form-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet!</p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="task-card">
              <div className="task-header">
                <h3 className="task-title">{t.title}</h3>
                <div className="task-badges">
                  <span
                    className={`task-status task-status-${t.status.toLowerCase()}`}
                  >
                    {t.status}
                  </span>
                  <span
                    className={`task-priority task-priority-${t.priority.toLowerCase()}`}
                  >
                    {t.priority}
                  </span>
                </div>
              </div>
              {t.description && (
                <p className="task-description">{t.description}</p>
              )}
              {t.deadline && (
                <p className="task-deadline">
                  <span className="task-deadline-label">Deadline:</span>{" "}
                  {formatDate(t.deadline)}
                </p>
              )}
              <div className="task-actions">
                <button
                  onClick={() => handleEdit(t)}
                  className="task-button task-button-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="task-button task-button-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
