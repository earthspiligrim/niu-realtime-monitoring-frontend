import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartDataPoint } from '../../types';

interface BarChartComponentProps {
  title: string;
  data: ChartDataPoint[];
  unit: string;
  color: string;
  domain: [number, number];
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  title,
  data,
  unit,
  color,
  domain
}) => {
  return (
    <motion.div 
      className="chart-section" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
    >
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit={unit} domain={domain} />
          <Tooltip />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};