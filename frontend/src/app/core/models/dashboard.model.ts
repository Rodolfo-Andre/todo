export interface DashboardData {
  stats: DashboardStats;
  tasksByStatus: TaskByStatus[];
  tasksByPriority: TaskByPriority[];
  tasksByMember: TaskByMember[];
  recentActivity: RecentActivity[];
  upcomingDeadlines: UpcomingDeadline[];
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  myAssignedTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalMembers: number;
}

export interface TaskByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface TaskByPriority {
  priority: string;
  count: number;
  percentage: number;
}

export interface TaskByMember {
  memberName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface RecentActivity {
  userName: string;
  action: string;
  taskTitle: string;
  projectName: string;
  createdAt: Date;
}

export interface UpcomingDeadline {
  taskTitle: string;
  projectName: string;
  assignedToName: string;
  dueDate: Date;
  daysRemaining: number;
  priority: number;
}
