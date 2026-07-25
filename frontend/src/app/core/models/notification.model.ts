export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: string;
  referenceType?: string;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  TaskAssigned = 0,
  TaskUpdated = 1,
  TaskStatusChanged = 2,
  CommentAdded = 3,
  ProjectUpdated = 4
}
