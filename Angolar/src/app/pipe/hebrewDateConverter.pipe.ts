import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'hebrewDateConverter'
})
export class HebrewDateConverterPipe implements PipeTransform {

  constructor(private http: HttpClient) {}

  transform(date: Date): Observable<string> {
     // המרת תאריך לפורמט YYYY-MM-DD
       const year = date.getFullYear();
       const month = String(date.getMonth() + 1).padStart(2, '0'); // מתקן את החודש מאינדקס 0
       const day = String(date.getDate()).padStart(2, '0');
       const formattedDate = `${year}-${month}-${day}`;
    const url = `https://www.hebcal.com/converter?cfg=json&date=${formattedDate}&g2h=1&strict=1`;
    return this.http.get<any>(url).pipe(
      map(response => response.hebrew ?? 'תאריך לא נמצא')
    );
  }
}
