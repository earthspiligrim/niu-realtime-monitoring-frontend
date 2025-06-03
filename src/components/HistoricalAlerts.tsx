import React from 'react';
import { motion } from 'framer-motion';
import { AlertData } from '../types';

interface HistoricalAlertsProps {
  alertData: AlertData[];
}

export const HistoricalAlerts: React.FC<HistoricalAlertsProps> = ({ alertData }) => {
  return (
    <motion.div 
      className="chart-section" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <h2>⚠️ Historical Alerts</h2>
      {alertData.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <ul className="alert-timeline">
          {alertData.map((alert, index) => (
            <li key={index} className="alert-item">
              <strong>{alert.timestamp}</strong> — 
              <span className="alert-metric">{alert.metric}</span> was 
              <span className="alert-value">{alert.value}</span> for 
              <b>{alert.contributor}</b> ({alert.severity})
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};