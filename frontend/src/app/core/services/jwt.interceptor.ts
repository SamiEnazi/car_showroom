import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthStateService } from './auth-state.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const token = authState.getToken();
  const isAuthRoute = req.url.includes('/api/auth/');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !isAuthRoute) {
        localStorage.removeItem('token');
        authState.clearUser();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};