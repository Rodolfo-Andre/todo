export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName?: string;
  projectKey?: string;
  assignedToId?: string;
  assignedToName?: string;
  createdById: string;
  createdByName: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints?: number;
  dueDate?: Date;
  orderIndex: number;
  tags?: string;
  commentCount: number;
  attachmentCount: number;
  createdAt: Date;
}

export interface TaskDetail extends Task {
  comments: TaskComment[];
  attachments: TaskAttachment[];
  histories: TaskHistory[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userFullName?: string;
  content: string;
  createdAt: Date;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  createdAt: Date;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

export enum TaskStatus {
  Todo = 0,
  InProgress = 1,
  InReview = 2,
  Done = 3,
  Cancelled = 4
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}
