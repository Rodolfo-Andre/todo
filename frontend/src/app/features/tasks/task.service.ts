import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/models/api-response.model';
import { Task, TaskDetail, TaskComment, TaskAttachment } from '../../core/models/task.model';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  priority: number;
  storyPoints?: number;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  priority: number;
  storyPoints?: number;
  dueDate?: Date;
  tags?: string[];
}

export interface ChangeStatusRequest {
  status: number;
}

export interface AssignTaskRequest {
  assignedToId?: string;
}

export interface ReorderTaskRequest {
  orderIndex: number;
  newStatus?: number;
}

export interface TaskFilters {
  status?: number;
  priority?: number;
  search?: string;
  assignedToId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasksByProject(projectId: string, filters?: TaskFilters): Observable<ApiResponse<Task[]>> {
    let params = new HttpParams();
    if (filters?.status !== undefined) params = params.set('status', filters.status.toString());
    if (filters?.priority !== undefined) params = params.set('priority', filters.priority.toString());
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.assignedToId) params = params.set('assignedToId', filters.assignedToId);

    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/project/${projectId}`, { params });
  }

  getTaskById(id: string): Observable<ApiResponse<TaskDetail>> {
    return this.http.get<ApiResponse<TaskDetail>>(`${this.apiUrl}/${id}`);
  }

  getMyTasks(filters?: TaskFilters): Observable<ApiResponse<Task[]>> {
    let params = new HttpParams();
    if (filters?.status !== undefined) params = params.set('status', filters.status.toString());
    if (filters?.priority !== undefined) params = params.set('priority', filters.priority.toString());
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/my`, { params });
  }

  createTask(request: CreateTaskRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, request);
  }

  updateTask(id: string, request: UpdateTaskRequest): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}`, request);
  }

  deleteTask(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  changeStatus(id: string, status: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.apiUrl}/${id}/status`, { status });
  }

  assignTask(id: string, assignedToId?: string): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.apiUrl}/${id}/assign`, { assignedToId });
  }

  reorderTask(id: string, orderIndex: number, newStatus?: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.apiUrl}/${id}/reorder`, { orderIndex, newStatus });
  }

  addComment(taskId: string, content: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/${taskId}/comments`, { content });
  }

  uploadAttachment(taskId: string, file: File): Observable<ApiResponse<TaskAttachment>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<TaskAttachment>>(`${this.apiUrl}/${taskId}/attachments`, formData);
  }

  getAttachments(taskId: string): Observable<ApiResponse<TaskAttachment[]>> {
    return this.http.get<ApiResponse<TaskAttachment[]>>(`${this.apiUrl}/${taskId}/attachments`);
  }

  deleteAttachment(attachmentId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/attachments/${attachmentId}`);
  }
}
