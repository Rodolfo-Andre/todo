import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/models/api-response.model';

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entityName: string;
  entityId?: string;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AuditLogSummary {
  totalLogs: number;
  todayLogs: number;
  logsByAction: Record<string, number>;
  logsByEntity: Record<string, number>;
  recentLogs: AuditLog[];
}

export interface AuditLogFilter {
  action?: string;
  entityName?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = `${environment.apiUrl}/audit`;

  constructor(private http: HttpClient) {}

  getAuditLogs(filter?: AuditLogFilter): Observable<ApiResponse<AuditLog[]>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.action) params = params.set('action', filter.action);
      if (filter.entityName) params = params.set('entityName', filter.entityName);
      if (filter.userId) params = params.set('userId', filter.userId);
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<ApiResponse<AuditLog[]>>(this.apiUrl, { params });
  }

  getAuditSummary(): Observable<ApiResponse<AuditLogSummary>> {
    return this.http.get<ApiResponse<AuditLogSummary>>(`${this.apiUrl}/summary`);
  }
}
