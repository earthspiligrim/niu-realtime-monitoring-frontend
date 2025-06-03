import { ChartDataPoint } from '../types';

export function smoothChange(prev: number, max: number, delta: number): number {
  const change = (Math.random() - 0.5) * delta * 2;
  return parseFloat(Math.max(0, Math.min(max, prev + change)).toFixed(2));
}

export function updateChartData(prev: ChartDataPoint[], value: number): ChartDataPoint[] {
  const now = new Date().toLocaleTimeString();
  return [...prev, { time: now, value }].slice(-12);
}