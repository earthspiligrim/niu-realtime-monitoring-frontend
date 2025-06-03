import React from 'react';
import { BarChart3 } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  toggleTheme: () => void;
  contributor: string;
  setContributor: (contributor: string) => void;
  exportToCSV: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  darkMode, 
  toggleTheme, 
  contributor, 
  setContributor,
  exportToCSV
}) => {
  const contributors = ["Rithika", "Mani", "Anatoliy"];

  return (
    <nav className="navbar">
      <div className="logo-title">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h1>📊 Real-Time Dashboard</h1>
      </div>
      <div className="nav-controls">
        <label>
          Select Contributor:
          <select 
            value={contributor} 
            onChange={(e) => setContributor(e.target.value)}
          >
            {contributors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button className="export-btn" onClick={exportToCSV}>
          📥 Export Alerts CSV
        </button>
      </div>
    </nav>
  );
};