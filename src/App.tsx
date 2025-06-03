import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { MetricsContainer } from './components/MetricsContainer';
import { AlertLog } from './components/AlertLog';
import { ChartSection } from './components/ChartSection';
import { TaskLog } from './components/TaskLog';
import { HistoricalAlerts } from './components/HistoricalAlerts';
import { Footer } from './components/Footer';
import { useMetricsData } from './hooks/useMetricsData';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [contributor, setContributor] = useState("Rithika");
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [alertData, setAlertData] = useState<AlertData[]>([]);
  const [taskData, setTaskData] = useState<TaskData[]>([]);
  
  const {
    metrics,
    cpuHistory,
    memoryHistory, 
    diskHistory,
    networkHistory,
    tempHistory,
    updateContributor
  } = useMetricsData(contributor, setAlertLogs);

  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => {
    updateContributor(contributor);
  }, [contributor, updateContributor]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) setAlertData(data.alerts);
      })
      .catch((err) => console.error("Error fetching alerts:", err));

    fetch("http://127.0.0.1:8000/task-log")
      .then((res) => res.json())
      .then((data) => {
        if (data.log) setTaskData(data.log);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const exportToCSV = () => {
    const rows = ["Contributor,Metric,Value,Time,Severity"];
    alertData.forEach(alert => {
      rows.push(`${alert.contributor},${alert.metric},${alert.value},${alert.timestamp},${alert.severity}`);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alert_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <Navigation 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        contributor={contributor}
        setContributor={setContributor}
        exportToCSV={exportToCSV}
      />

      <p className="timestamp-note">
        Metrics update every 5 seconds for <strong>{contributor}</strong>
      </p>

      {alertLogs.length > 0 && (
        <AlertLog alertLogs={alertLogs} />
      )}

      <MetricsContainer metrics={metrics} />

      <ChartSection 
        cpuHistory={cpuHistory}
        memoryHistory={memoryHistory}
        diskHistory={diskHistory}
        networkHistory={networkHistory}
        tempHistory={tempHistory}
      />

      <TaskLog taskData={taskData} />

      <HistoricalAlerts alertData={alertData} />

      <Footer />
    </div>
  );
}

export default App;