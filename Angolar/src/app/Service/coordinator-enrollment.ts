import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoordinatorEnrollment {

  private apiUrl = 'https://localhost:7000/api/Coordinator';

  constructor(private http: HttpClient) {}

  registerCoordinator(formData: any): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/register`,
      formData
    );

  }
  
}
