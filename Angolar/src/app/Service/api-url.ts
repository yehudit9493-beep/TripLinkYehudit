import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// שירות עזר להמרת נתיב תמונה יחסי (uploads/...) לכתובת מלאה הניתנת להצגה ב-<img>.
// השרת שומר את התמונות בתיקיית wwwroot/uploads ומחזיר נתיב יחסי בלבד.
export class ApiUrl {
  readonly baseUrl = 'https://localhost:7216';

  getImageUrl(path?: string | null): string {
    if (!path) return '';
    if (
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('data:') ||
      path.startsWith('/')
    ) {
      return path;
    }
    return `${this.baseUrl}/${path}`;
  }
}
