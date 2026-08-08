import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TranslationService } from '../i18n/translation.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const translationService = inject(TranslationService);
  const t = translationService.translate.bind(translationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // For 400 errors (validation errors), pass the backend error message
      if (error.status === 400 && error.error?.errors) {
        const backendMessage = error.error.errors[0] || t('errors.validation');
        return throwError(() => new Error(backendMessage));
      }

      // For 400 errors with a message property
      if (error.status === 400 && error.error?.message) {
        return throwError(() => new Error(error.error.message));
      }

      let errorMessage = t('errors.unexpected');

      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/auth/login']);
        errorMessage = t('errors.sessionExpired');
      } else if (error.status === 403) {
        errorMessage = t('errors.forbidden');
      } else if (error.status === 404) {
        errorMessage = t('errors.notFound');
      } else if (error.status >= 500) {
        errorMessage = t('errors.serverError');
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
