import React, { useEffect, useState } from 'react';
import './Dashboard.css';

interface Task {
  id: string;
  name: string;
  status: string;
  last_updated: string;
}

interface ApiResponse {
  tasks: Task[];
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Get API URL from environment variable, default to localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tasks';

  const fetchTasks = async () => {
    try {
      setError(null);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setTasks(data.tasks);
      setLastRefresh(new Date());
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTasks();

    // Set up interval to refresh every 10 seconds
    const interval = setInterval(() => {
      fetchTasks();
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once on mount

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getStatusClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'complete') return 'status-complete';
    if (statusLower === 'in_progress') return 'status-in-progress';
    if (statusLower === 'pending') return 'status-pending';
    return 'status-default';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>ClickUp Task Dashboard</h1>
        <div className="refresh-info">
          <span>Last refreshed: {lastRefresh.toLocaleTimeString()}</span>
          <span className="refresh-interval">Auto-refreshing every 10 seconds</span>
        </div>
      </header>

      <main className="dashboard-main">
        {loading && <div className="loading">Loading tasks...</div>}
        
        {error && (
          <div className="error">
            <p>Error loading tasks: {error}</p>
            <p>API URL: {API_URL}</p>
            <button onClick={fetchTasks}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div className="tasks-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="no-tasks">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="task-name">{task.name}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="task-updated">{formatDate(task.last_updated)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

