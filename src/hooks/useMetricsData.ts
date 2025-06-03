import { useState, useEffect, useCallback } from 'react';
import { Metric, ChartDataPoint, AlertLog } from '../types';
import { smoothChange, updateChartData } from '../utils/metricsUtils';

export const useMetricsData = (contributor: string, setAlertLogs: React.Dispatch<React.SetStateAction<AlertLog[]>>) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [cpuHistory, setCpuHistory] = useState<ChartDataPoint[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<ChartDataPoint[]>([]);
  const [diskHistory, setDiskHistory] = useState<ChartDataPoint[]>([]);
  const [networkHistory, setNetworkHistory] = useState<ChartDataPoint[]>([]);
  const [tempHistory, setTempHistory] = useState<ChartDataPoint[]>([]);
  
  const [cpuValue, setCpuValue] = useState(50);
  const [memoryValue, setMemoryValue] = useState(8);
  const [diskValue, setDiskValue] = useState(40);
  const [networkValue, setNetworkValue] = useState(20);
  const [tempValue, setTempValue] = useState(50);
  const [cpuHighCount, setCpuHighCount] = useState(0);

  const updateMetrics = useCallback(() => {
    const now = new Date().toLocaleTimeString();
    const current = contributor;

    const newCpu = smoothChange(cpuValue, 100, 3);
    const newMemory = smoothChange(memoryValue, 16, 1);
    const newDisk = smoothChange(diskValue, 100, 2);
    const newNetwork = smoothChange(networkValue, 100, 4);
    const newTemp = smoothChange(tempValue, 90, 1.5);

    setCpuValue(newCpu);
    setMemoryValue(newMemory);
    setDiskValue(newDisk);
    setNetworkValue(newNetwork);
    setTempValue(newTemp);

    setCpuHistory(prev => updateChartData(prev, newCpu));
    setMemoryHistory(prev => updateChartData(prev, newMemory));
    setDiskHistory(prev => updateChartData(prev, newDisk));
    setNetworkHistory(prev => updateChartData(prev, newNetwork));
    setTempHistory(prev => updateChartData(prev, newTemp));

    setMetrics([
      { name: "CPU Usage", value: `${newCpu}%`, timestamp: now, contributor: current },
      { name: "Memory Usage", value: `${newMemory} GB`, timestamp: now, contributor: current },
      { name: "Disk Usage", value: `${newDisk}%`, timestamp: now, contributor: current },
      { name: "Network Usage", value: `${newNetwork}%`, timestamp: now, contributor: current },
      { name: "Temperature", value: `${newTemp} °C`, timestamp: now, contributor: current }
    ]);

    if (newCpu > 75) {
      setCpuHighCount(prev => {
        const newCount = prev + 1;
        const alertMessage =
          newCount >= 3
            ? `🚨 Escalation: CPU remains high for ${current} (Email sent to professor)`
            : `⚠️ Alert: CPU usage high for ${current} at ${newCpu.toFixed(2)}% (Email sent to ${current})`;

        setAlertLogs(logs => [
          ...logs,
          {
            timestamp: now,
            contributor: current,
            severity: newCount >= 3 ? "escalation" : "warning",
            message: alertMessage
          }
        ]);
        return newCount;
      });
    } else {
      setCpuHighCount(0);
    }
  }, [
    contributor, 
    cpuValue, 
    memoryValue, 
    diskValue, 
    networkValue, 
    tempValue, 
    setAlertLogs
  ]);

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  const updateContributor = useCallback((newContributor: string) => {
    // This function is used when the contributor changes
    // The dependency on updateMetrics will ensure the data refreshes
  }, []);

  return {
    metrics,
    cpuHistory,
    memoryHistory,
    diskHistory,
    networkHistory,
    tempHistory,
    updateContributor
  };
};