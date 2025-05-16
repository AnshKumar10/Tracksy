export interface TaskTypeInterface {
  _id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  createdAt: string;
}

export interface TaskDistributionTypeInterface {
  Pending: number;
  InProgress: number;
  Completed: number;
  All: number;
}

export interface TaskPriorityTypeInterface {
  Low: number;
  Medium: number;
  High: number;
}

export interface StatisticsTypeInterface {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overDueTasks: number;
}

export interface ChartsTypeInterface {
  taskDistribution: TaskDistributionTypeInterface;
  taskPriority: TaskPriorityTypeInterface;
}

export interface DashboardDataTypeInterface {
  statistics: StatisticsTypeInterface;
  charts: ChartsTypeInterface;
  recentTasks: TaskTypeInterface[];
}
