import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import TaskList from "./components/TaskList";
import { verifyToken } from "./api/client";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("access") || "");

  function handleLogin(newToken) {
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken("");
  }

  useEffect(() => {
    async function checkToken() {
      const access = localStorage.getItem("access");
      if (!access) {
        return;
      }

      const isValid = await verifyToken(access);
      if (!isValid) {
        handleLogout();
      }
    }

    checkToken();
  }, []);

  return (
    <div className="app-container">
      {token ? (
        <>
          <header className="app-header">
            <h1>Task Manager</h1>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </header>
          <TaskList token={token} onLogout={handleLogout} />
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}
