import React from 'react';
import { motion } from 'framer-motion';
import { TaskData } from '../types';

interface TaskLogProps {
  taskData: TaskData[];
}

export const TaskLog: React.FC<TaskLogProps> = ({ taskData }) => {
  return (
    <motion.div 
      className="task-log" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <h2>📋 Task Timeline</h2>
      <div className="task-list">
        {taskData.length === 0 ? (
          <p>No task history found.</p>
        ) : (
            <ul>
            {taskData.map((task: TaskData, index: number) => (
              <li key={index}>
              <strong>{task.timestamp}</strong> — {task.task} by <b>{task.contributor}</b>
              </li>
            ))}
            </ul>
        )}
      </div>
    </motion.div>
  );
};