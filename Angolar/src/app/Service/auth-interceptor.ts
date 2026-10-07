import { HttpInterceptorFn } from '@angular/common/http';

/**
 * אינטרספטור שמוסיף לראש בקשות HTTP אל השרת שלנו את ה-JWT (Authorization: Bearer).
 * הטוקן נשמר ב-localStorage בתוך אובייקט "currentUser" (שדה token).
 * אם אין טוקן - הבקשה נשלחת כרגיל (כתלות ברמת האבטחה של השרת).
 *
 * חשוב: האינטרספטור מוסיף את הטוקן אך ורק לבקשות שעוברות אל השרת המקומי
 * (https://localhost:7216). בקשות API חיצוניות (כגון הבה"ל / hebcal.com לקריאת
 * תאריך עברי) נשלחות ללא כותרת Authorization, כיוון שהשרת החיצוני עלול לדחות
 * אותן אם נשלח אליו טוקן לא רלוונטי.
 */
const API_ORIGIN = 'https://localhost:7216';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // אם הבקשה אינה לשרת שלנו (כלומר דומיין חיצוני) - שלח אותה ללא טוקן
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
