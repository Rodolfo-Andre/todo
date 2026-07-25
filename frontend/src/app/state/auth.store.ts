import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authService = inject(AuthService);

  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;
  isLoading = this.authService.isLoading;
  isAdmin = this.authService.isAdmin;
}
