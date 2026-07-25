import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private _user = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);

  user = this._user.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  isLoading = this._isLoading.asReadonly();
  isAdmin = computed(() => this._user()?.roles?.includes('Admin') ?? false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('accessToken');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this._user.set(user);
        this._isAuthenticated.set(true);
      } catch {
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    this._isLoading.set(true);
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap({
          next: (response) => {
            if (response.success && response.data) {
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              this._user.set(response.data.user);
              this._isAuthenticated.set(true);
            }
            this._isLoading.set(false);
          },
          error: () => {
            this._isLoading.set(false);
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    this._isLoading.set(true);
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/register`, data)
      .pipe(
        tap({
          next: (response) => {
            if (response.success && response.data) {
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              this._user.set(response.data.user);
              this._isAuthenticated.set(true);
            }
            this._isLoading.set(false);
          },
          error: () => {
            this._isLoading.set(false);
          }
        })
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      complete: () => {
        this.clearStorage();
        this._user.set(null);
        this._isAuthenticated.set(false);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
        })
      );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`);
  }
}
