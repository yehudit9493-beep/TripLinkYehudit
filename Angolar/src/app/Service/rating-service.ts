// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// export interface Rating {
//   entityType: 'trail' | 'attraction' | 'guide' | 'accommodation';
//   entityId: number;
//   stars: number;
//   comment: string;
//   raterName: string;
//   date: Date;
// }

// @Injectable({ providedIn: 'root' })
// export class RatingService {

//   private readonly API_URL = 'https://localhost:7216/api/Ratings';

//   pendingRatingTrailId: number | null = null;
//   pendingRatingAttractionId: number | null = null;
//   pendingRatingGuideId: number | null = null;
//   pendingRatingHotelId: number | null = null;

//   // מטמון מקומי של ממוצעים לפי "סוג:מזהה" — מאפשר הצגה סינכרונית
//   // בטבלאות הרשימות (קומפוננטות האב). נטען מהשרת דרך loadAverage.
//   private avgCache: Map<string, number> = new Map();

//   constructor(private httpClient: HttpClient) { }

//   // ✅ הבאת כל הדירוגים של ישות מהשרת (להצגה בדף הדירוגים המלא)
//   getRatings(entityType: string, entityId: number): Observable<Rating[]> {
//     return this.httpClient.get<any[]>(`${this.API_URL}/${entityType}/${entityId}`).pipe(
//       map(rows => (rows ?? []).map(row => this.mapToAngular(entityType, entityId, row)))
//     );
//   }

//   // ✅ טעינת ממוצע הדירוגים של ישות מהשרת אל המטמון
//   //    מחזיר Observable כך שקומפוננטות יוכלו להירשם לעדכון,
//   //    ומעדכן את המטמון ש- getAverageRating הסינכרוני יחזיר את הערך.
//   loadAverage(entityType: string, entityId: number): Observable<number> {
//     return this.httpClient.get<any>(`${this.API_URL}/${entityType}/${entityId}/average`).pipe(
//       map(res => {
//         const avg = res.average ?? 0;
//         this.avgCache.set(this.key(entityType, entityId), avg);
//         return avg;
//       })
//     );
//   }

//   // ✅ טעינת הממוצעים של כל הישויות לרשימה נתונה אל המטמון
//   //    נקרא מהקומפוננטות של הרשימות כך שעמודת הדירוג תוצג מייד.
//   loadAverages(entityType: string, ids: number[]): void {
//     (ids ?? []).forEach(id => this.loadAverage(entityType, id).subscribe());
//   }

//   // ✅ קריאה סינכרונית של ממוצע הדירוגים (מתוך המטמון, 0 אם עדיין לא נטען)
//   getAverageRating(entityType: string, entityId: number): number {
//     return this.avgCache.get(this.key(entityType, entityId)) ?? 0;
//   }

//   // ✅ בדיקה אם המשתמש כבר דירג את הישות
//   hasRated(entityType: string, entityId: number, userId: number): Observable<boolean> {
//     return this.httpClient.get<{ hasRated: boolean }>(`${this.API_URL}/has-rated/${entityType}/${entityId}/${userId}`).pipe(
//       map(res => !!res.hasRated)
//     );
//   }

//   // ✅ הוספת דירוג חדש לשרת
//   addRating(rating: Rating, userId: number): Observable<Rating> {
//     const body = {
//       entityType: rating.entityType,
//       entityId: rating.entityId,
//       userId,
//       stars: rating.stars,
//       comment: rating.comment
//     };
//     return this.httpClient.post<any>(this.API_URL, body).pipe(
//       map(() => rating)
//     );
//   }

//   // ✅ מערך של כוכבים להצגת דירוג (טהור וסינכרוני)
//   getStarsArray(rating: number, maxStars: number = 5): string[] {
//     const rounded = Math.round(rating);
//     return Array.from({ length: maxStars }, (_, i) => i < rounded ? 'full' : 'empty');
//   }

//   private mapToAngular(entityType: string, entityId: number, server: any): Rating {
//     return {
//       entityType: entityType as Rating['entityType'],
//       entityId,
//       stars: server.stars,
//       comment: server.comment ?? '',
//       raterName: server.raterName ?? '',
//       date: new Date(server.ratingDate)
//     };
//   }

//   private key(entityType: string, entityId: number): string {
//     return `${entityType}:${entityId}`;
//   }
// }


import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Rating {
  entityType: 'trail' | 'attraction' | 'guide' | 'accommodation';
  entityId: number;
  stars: number;
  comment: string;
  raterName: string;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class RatingService {

  private readonly API_URL = 'https://localhost:7216/api/Ratings';

  pendingRatingTrailId: number | null = null;
  pendingRatingAttractionId: number | null = null;
  pendingRatingGuideId: number | null = null;
  pendingRatingHotelId: number | null = null;

  private avgCache: Map<string, number> = new Map();

  // ✅ מתריע על כל עדכון ממוצעים — קומפוננטות האב נרשמות כדי לרענן את התצוגה
  private averagesChanged$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  // ✅ התראה כשממוצע משתנה (מאפשר עדכון מיידי בטבלאות, גם עם OnPush)
  averagesChanged(): Observable<void> {
    return this.averagesChanged$.asObservable();
  }

  // ✅ הבאת כל הדירוגים של ישות מהשרת (להצגה בדף הדירוגים המלא)
  //    זה נוסף פרמטר מזהה כדי למנוע מטמון של דפדפן/שרת שיוביל להצגת נתונים ישנים
  getRatings(entityType: string, entityId: number): Observable<Rating[]> {
    // אבחון: מדפסים את ה-URL כדי לוודא שהבקשה נשלחת לנתיב הצפוי
    console.log(`[Ratings] GET ${this.API_URL}/${entityType}/${entityId}`);
    return this.httpClient.get<any[]>(`${this.API_URL}/${entityType}/${entityId}`).pipe(
      map(rows => (rows ?? []).map(row => this.mapToAngular(entityType, entityId, row))),
      tap({
        next: () => console.log(`[Ratings] loaded for ${entityType}/${entityId}`),
        error: (err) => console.error(`[Ratings] error for ${entityType}/${entityId}:`, err)
      }),
      // בכל מקרה מחזירים מערך (ריק אם נכשל) כדי לא להיתקע על "טוען דירוגים..."
      catchError(() => of([] as Rating[]))
    );
  }

  // ✅ טעינת ממוצע הדירוגים של ישות מהשרת אל המטמון
  //    מחזיר Observable כך שקומפוננטות יוכלו להירשם לעדכון,
  //    ומעדכן את המטמון ש- getAverageRating הסינכרוני יחזיר את הערך.
  loadAverage(entityType: string, entityId: number): Observable<number> {
    return this.httpClient.get<any>(`${this.API_URL}/${entityType}/${entityId}/average`).pipe(
      map(res => {
        const avg = res.average ?? 0;
        this.avgCache.set(this.key(entityType, entityId), avg);
        // פליטת ההתראה מחוץ ל-tick הנוכחי של Angular.
        // זה מונע NG0100 (ExpressionChangedAfterItHasBeenCheckedError) —
        // מצב שבו ה- markForCheck() של קומפוננטות האב מבקש CD נוסף
        // באותו frame שבו ה-HTTP חזר, וגורם לשינוי ערכים בתבנית.
        this.emitAveragesChanged();
        return avg;
      })
    );
  }

  private emitAveragesChanged() {
    // דחייה אסינכרונית כך שההתראה תגיע אחרי שה-change detection הנוכחי הסתיים
    queueMicrotask(() => this.averagesChanged$.next());
  }

  // ✅ טעינת הממוצעים של כל הישויות לרשימה נתונה אל המטמון
  //    נקרא מהקומפוננטות של הרשימות כך שעמודת הדירוג תוצג מייד.
  loadAverages(entityType: string, ids: number[]): void {
    (ids ?? []).forEach(id => {
      this.loadAverage(entityType, id).subscribe({
        error: (err) => console.error(`Error loading average for ${entityType}:${id}`, err)
      });
    });
  }

  // ✅ קריאה סינכרונית של ממוצע הדירוגים (מתוך המטמון, 0 אם עדיין לא נטען)
  getAverageRating(entityType: string, entityId: number): number {
    return this.avgCache.get(this.key(entityType, entityId)) ?? 0;
  }

  // ✅ בדיקה אם המשתמש כבר דירג את הישות
  hasRated(entityType: string, entityId: number, userId: number): Observable<boolean> {
    return this.httpClient.get<{ hasRated: boolean }>(`${this.API_URL}/has-rated/${entityType}/${entityId}/${userId}`).pipe(
      map(res => !!res.hasRated)
    );
  }

  // ✅ הוספת דירוג חדש לשרת
  addRating(rating: Rating, userId: number): Observable<Rating> {
    const body = {
      entityType: rating.entityType,
      entityId: rating.entityId,
      userId,
      stars: rating.stars,
      comment: rating.comment
    };
    return this.httpClient.post<any>(this.API_URL, body).pipe(
      map(() => rating)
    );
  }

  // ✅ מערך של כוכבים להצגת דירוג (טהור וסינכרוני)
  getStarsArray(rating: number, maxStars: number = 5): string[] {
    const rounded = Math.round(rating);
    return Array.from({ length: maxStars }, (_, i) => i < rounded ? 'full' : 'empty');
  }

  private mapToAngular(entityType: string, entityId: number, server: any): Rating {
    return {
      entityType: entityType as Rating['entityType'],
      entityId,
      stars: server.stars,
      comment: server.comment ?? '',
      raterName: server.raterName ?? '',
      date: new Date(server.ratingDate)
    };
  }

  private key(entityType: string, entityId: number): string {
    return `${entityType}:${entityId}`;
  }
}