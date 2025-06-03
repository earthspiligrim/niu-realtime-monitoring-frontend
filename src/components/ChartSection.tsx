import React from 'react';
import { LineChartComponent } from './charts/LineChartComponent';
import { BarChartComponent } from './charts/BarChartComponent';
import { ChartDataPoint } from '../types';

interface ChartSectionProps {
  cpuHistory: ChartDataPoint[];
  memoryHistory: ChartDataPoint[];
  diskHistory: ChartDataPoint[];
  networkHistory: ChartDataPoint[];
  tempHistory: ChartDataPoint[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  cpuHistory,
  memoryHistory,
  diskHistory,
  networkHistory,
  tempHistory
}) => {
  return (
    <>
      <LineChartComponent 
        title="CPU Usage Over Time"
        data={cpuHistory}
        unit="%"
        color="#3b82f6"
        domain={[0, 100]}
      />
      <LineChartComponent 
        title="Memory Usage Over Time"
        data={memoryHistory}
        unit="GB"
        color="#10b981"
        domain={[0, 20]}
      />
      <LineChartComponent 
        title="Disk Usage Over Time"
        data={diskHistory}
        unit="%"
        color="#f97316"
        domain={[0, 100]}
      />
      <LineChartComponent 
        title="Temperature Over Time"
        data={tempHistory}
        unit="°C"
        color="#facc15"
        domain={[30, 90]}
      />
      <BarChartComponent 
        title="Network Usage (Bar Chart)"
        data={networkHistory}
        unit="%"
        color="#60a5fa"
        domain={[0, 100]}
      />
    </>
  );
};