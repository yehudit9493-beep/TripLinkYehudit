import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../Service/auth';

const ADMIN_PERMISSIONS = [1, 2];

export const adminGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  const permissions = authService.getCurrentUserPermission();
  const isAdmin = permissions.some(p => ADMIN_PERMISSIONS.includes(p));

  if (isAdmin) {
    return true;
  }

  router.navigate(['/home-page']);
  return false;
};
