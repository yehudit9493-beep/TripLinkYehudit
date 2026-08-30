import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Enrollment {
  
  private apiUrl = 'https://localhost:7000/api/Guide';

  constructor(private http: HttpClient) {}

  registerGuide(formData: FormData): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/register`,
      formData
    );

  }
  
}
