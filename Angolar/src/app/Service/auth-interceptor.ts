import { HttpInterceptorFn } from '@angular/common/http';

const API_ORIGIN = 'https://localhost:7216';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // אם הבקשה אינה לשרת המקומי - שלח אותה ללא טוקן
  if (!req.url.startsWith(API_ORIGIN)) {
    return next(req);
  }

  const saved = localStorage.getItem('currentUser');
  let token = '';

  if (saved) {
    try {
      const user = JSON.parse(saved);
      token = (user && user.token) ? String(user.token) : '';
    } catch {
      // אם ה-JSON פגום - מתעלמים ונשלח ללא טוקן
      token = '';
    }
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
