export interface Metric {
  name: string;
  value: string;
  timestamp: string;
  contributor: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}
  export type AlertLog = {
    message: string;
    timestamp: string;
    severity?: string;
    // Add other fields as needed
  };
  
// export interface AlertLog {
//   time: string;
//   contributor: string;
//   level: 'warning' | 'escalation';
//   message: string;
// }

export interface AlertData {
  contributor: string;
  metric: string;
  value: string;
  timestamp: string;
  severity: string;
}

export interface TaskData {
  timestamp: string;
  task: string;
  contributor: string;
}