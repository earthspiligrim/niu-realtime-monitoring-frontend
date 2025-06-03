import React from 'react';
import { motion } from 'framer-motion';
import { Metric } from '../types';

interface MetricsContainerProps {
  metrics: Metric[];
}

export const MetricsContainer: React.FC<MetricsContainerProps> = ({ metrics }) => {
  return (
    <div className="metrics-container">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} metric={metric} index={idx} />
      ))}
    </div>
  );
};

interface MetricCardProps {
  metric: Metric;
  index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, index }) => {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <h2>{metric.name}</h2>
      <p className="value">{metric.value}</p>
      <p className="timestamp">{metric.timestamp}</p>
      <p className="contributor">👤 {metric.contributor}</p>
    </motion.div>
  );
};