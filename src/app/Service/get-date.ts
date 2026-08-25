import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDate {

  constructor(private httpClient: HttpClient) { }

  GetDateHebrew(): Observable<any> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');


        const currentDate: string = new Date().toISOString().split('T')[0]; 
    return this.httpClient.get<any>(`https://www.hebcal.com/converter?cfg=json&date=${currentDate}&g2h=1&strict=1`)
  }

}
