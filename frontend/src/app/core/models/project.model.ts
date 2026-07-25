export interface Project {
  id: string;
  name: string;
  description?: string;
  key: string;
  ownerId: string;
  status: number;
  createdAt: Date;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  projectRole: number;
  joinedAt: Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}
