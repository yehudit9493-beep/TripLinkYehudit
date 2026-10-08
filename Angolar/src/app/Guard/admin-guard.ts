import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../Service/auth';

/** הרשאות מנהל - 1 ו-2 */
const ADMIN_PERMISSIONS = [1, 2];

/**
 * גווארד לדף ניהול משתמשים (user-management).
 * רק למשתמשים עם הרשאת מנהל (1 או 2).
 * אם אין הרשאת מנהל - מונע את הניתוב ומחזיר לדף הבית.
 */
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
