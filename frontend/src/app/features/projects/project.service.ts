import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/models/api-response.model';

export interface Project {
  id: string;
  name: string;
  description?: string;
  key: string;
  ownerId: string;
  ownerName?: string;
  status: number;
  taskCount: number;
  memberCount: number;
  createdAt: Date;
}

export interface ProjectMember {
  id: string;
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  projectRole: number;
  joinedAt: Date;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  key: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  status: number;
}

export interface AddMemberRequest {
  userId: string;
  projectRole: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ApiResponse<Project[]>> {
    return this.http.get<ApiResponse<Project[]>>(this.apiUrl);
  }

  getProjectById(id: string): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/${id}`);
  }

  createProject(request: CreateProjectRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, request);
  }

  updateProject(id: string, request: UpdateProjectRequest): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${id}`, request);
  }

  deleteProject(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  getProjectMembers(id: string): Observable<ApiResponse<ProjectMember[]>> {
    return this.http.get<ApiResponse<ProjectMember[]>>(`${this.apiUrl}/${id}/members`);
  }

  addMember(id: string, request: AddMemberRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/${id}/members`, request);
  }

  removeMember(id: string, userId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}/members/${userId}`);
  }
}
