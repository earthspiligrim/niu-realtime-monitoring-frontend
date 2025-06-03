import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartDataPoint } from '../../types';

interface LineChartComponentProps {
  title: string;
  data: ChartDataPoint[];
  unit: string;
  color: string;
  domain: [number, number];
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={domain} unit={unit} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot 
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};