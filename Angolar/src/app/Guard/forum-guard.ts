import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from '../Service/auth';
import { Forums } from '../Service/forums';

/**
 * גווארד לדף כתיבת הודעה חדשה בפורום (addbForum/:forumId).
 * אם למשתמש אין הרשאת כתיבה בפורום זה - מונע את הניתוב ומחזיר לפורום עצמו.
 */
export const forumGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(Auth);
  const forums = inject(Forums);
  const router = inject(Router);

  const forumId = route.paramMap.get('forumId');
  const currentForumId = forumId ? +forumId : 1;

  const config = forums.forumConfig[currentForumId];
  const userPermissions = auth.getCurrentUserPermission();
  // ריק = כולם רשאים; אחרת רק בעלי אחת מההרשאות הנדרשות
  const canPost =
    !config || config.canPost.length === 0 ||
    config.canPost.some(p => userPermissions.includes(p));

  if (canPost) {
    return true;
  }

  router.navigate([`/forum/${currentForumId}`]);
  return false;
};
