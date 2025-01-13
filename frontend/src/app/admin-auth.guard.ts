import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { map, take } from 'rxjs/operators';
import { NotificationsService } from './core/services/notifications.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notifications = inject(NotificationsService);
  return authService.user$.pipe(
    take(1),
    map(user => {
      const isAdmin = user?.role === 'ADMIN';
      if (!isAdmin) {
        router.navigate(['/dashboard']);
        notifications.showError('Unauthorized!', 'Error');
      }
      return isAdmin;
    })
  );
};