import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUser, PermissionType } from '../Interfacess/admin-user';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  private readonly API_URL = 'https://localhost:7216/api/UserAdmin';

  constructor(private http: HttpClient) {}

  // רשימת כל המדריכות (Users בעלי רשומת Guide)
  getGuides(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.API_URL}/guides`);
  }

  // רשימת כל הרכזות (Users בעלי רשומת Coordinator)
  getCoordinators(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.API_URL}/coordinators`);
  }

  // רשימת כל המנהלים (Users בעלי הרשאת 1 או 2)
  getAdmins(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.API_URL}/admins`);
  }

  // כל קטגוריות ההרשאות (לתיבות הסימון)
  getPermissionTypes(): Observable<PermissionType[]> {
    return this.http.get<PermissionType[]>(`${this.API_URL}/permission-types`);
  }

  // סוג הפרופיל של משתמש לפי userId ("coordinator" / "guide" / "none")
  getProfileType(userId: number): Observable<{ profileType: string }> {
    return this.http.get<{ profileType: string }>(`${this.API_URL}/profile-type/${userId}`);
  }

  // עדכון סטטוס חסימה של משתמש
  setBlocked(userId: number, isBlocked: boolean): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${userId}/block`, { isBlocked });
  }

  // עדכון הרשאות משתמש
  updatePermissions(userId: number, permissionIds: number[]): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${userId}/permissions`, { permissionIds });
  }
}
