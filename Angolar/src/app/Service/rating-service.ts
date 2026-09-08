import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  // מטמון מקומי של ממוצעים לפי "סוג:מזהה" — מאפשר הצגה סינכרונית
  // בטבלאות הרשימות (קומפוננטות האב). נטען מהשרת דרך loadAverage.
  private avgCache: Map<string, number> = new Map();

  constructor(private httpClient: HttpClient) { }

  // ✅ טעינת ממוצע הדירוגים של ישות מהשרת אל המטמון
  //    מחזיר Observable כך שקומפוננטות יוכלו להירשם לעדכון,
  //    ומעדכן את המטמון ש- getAverageRating הסינכרוני יחזיר את הערך.
  loadAverage(entityType: string, entityId: number): Observable<number> {
    return this.httpClient.get<any>(`${this.API_URL}/${entityType}/${entityId}/average`).pipe(
      map(res => {
        const avg = res.average ?? 0;
        this.avgCache.set(this.key(entityType, entityId), avg);
        return avg;
      })
    );
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
