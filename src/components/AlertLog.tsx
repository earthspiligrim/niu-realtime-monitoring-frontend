import React from 'react';
import { AlertLog as AlertLogType } from '../types';

interface AlertLogProps {
  alertLogs: AlertLogType[];
}

export const AlertLog: React.FC<AlertLogProps> = ({ alertLogs }) => {
  return (
    <div className="alert-log-box">
      <h2>⚠️ Alert Log Timeline</h2>
      <ul>
        {alertLogs.slice(-5).map((log, i) => (
          <li key={i} className={log.level}>
            [{log.time}] {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
};