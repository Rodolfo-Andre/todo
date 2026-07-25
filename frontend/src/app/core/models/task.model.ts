export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  createdById: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints?: number;
  dueDate?: Date;
  orderIndex: number;
  tags?: string;
  createdAt: Date;
}

export interface TaskDetail extends Task {
  assignedTo?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
  createdByUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  histories?: TaskHistory[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
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
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
  user?: {
    id: string;
    fullName: string;
  };
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
