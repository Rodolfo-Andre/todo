import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BaseResponse } from '../../core/models/response.model';
import { environment } from '../../../environments/environment';

export interface Profile {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isActive: boolean;
  roles: string[];
  createdAt: Date;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;
  currentProfile = signal<Profile | null>(null);

  constructor(private http: HttpClient) {}

  getProfile(): Observable<BaseResponse<Profile>> {
    return this.http.get<BaseResponse<Profile>>(this.apiUrl).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.currentProfile.set(response.data);
        }
      })
    );
  }

  updateProfile(request: UpdateProfileRequest): Observable<BaseResponse<boolean>> {
    return this.http.put<BaseResponse<boolean>>(this.apiUrl, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<BaseResponse<boolean>> {
    return this.http.post<BaseResponse<boolean>>(`${this.apiUrl}/change-password`, request);
  }
}
