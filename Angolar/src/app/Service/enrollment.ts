import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Enrollment {

  private apiUrl = 'https://localhost:7216/api/Guide';

  constructor(private http: HttpClient) {}

  // שליחת טופס ההרשמה (כולל קבצים)
  registerGuide(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  // רשימת השתייכות דתית: [{ religiousId, religiousName }]
  getReligious(): Observable<{ religiousId: number; religiousName: string }[]> {
    return this.http.get<{ religiousId: number; religiousName: string }[]>(`${this.apiUrl}/religious`);
  }

  // רשימת אזורי הכשרה: [{ areaId, areaName }]
  getAreas(): Observable<{ areaId: number; areaName: string }[]> {
    return this.http.get<{ areaId: number; areaName: string }[]>(`${this.apiUrl}/areas`);
  }

  // רשימת ערים (מערך שמות)
  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cities`);
  }
}