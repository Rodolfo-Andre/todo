import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // For 400 errors (validation errors), pass the backend error message
      if (error.status === 400 && error.error?.errors) {
        const backendMessage = error.error.errors[0] || 'Validation error';
        return throwError(() => new Error(backendMessage));
      }

      // For 400 errors with a message property
      if (error.status === 400 && error.error?.message) {
        return throwError(() => new Error(error.error.message));
      }

      let errorMessage = 'An unexpected error occurred';

      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/auth/login']);
        errorMessage = 'Session expired. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
