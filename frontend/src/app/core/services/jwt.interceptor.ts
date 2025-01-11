import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the JWT token from the AuthService
  const token = authService.getToken();

  // Clone the request and add the Authorization header if a token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the request and catch errors
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Unauthorized: Token might be expired or invalid
        authService.logout(); // Clear the token and user data
        router.navigate(['/auth/login']); // Redirect to login page
      }
      return throwError(() => error);
    })
  );
};