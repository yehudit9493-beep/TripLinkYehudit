import { Injectable } from '@angular/core';
import { Trail, TrailWithoutId } from '../Interfacess/Trail';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // חובה לוודא שהשורה הזו קיימת בייבוא

export interface DeleteTrailResponse {
  isSuccess: boolean;
  message: string;
  routeId: number;
  rowsAffected: number;
  deletedAt: string;
}


@Injectable({
  providedIn: 'root',
})
export class TrailsService {

  private readonly USE_MOCK = false;
  private readonly API_URL = 'https://localhost:7216/api';

  constructor(private httpClient: HttpClient) { }

  GetTrail(): Observable<Trail[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/Routes`).pipe(
      map(serverRoutes => serverRoutes.map(route => this.mapToAngular(route)))
    );
  }

  getTrails(): Observable<Trail[]> {
    return this.GetTrail();
  }

  getTrailById(id: number): Observable<Trail> {
    return this.httpClient.get<any>(`${this.API_URL}/Routes/${id}`).pipe(
      map(route => this.mapToAngular(route))
    );
  }

  UpdateTrail(updatedTrail: Trail): Observable<Trail> {
    const body = this.mapToSever(updatedTrail);
    return this.httpClient.put<any>(`${this.API_URL}/Routes/${updatedTrail.id}`, body).pipe(
      map(route => this.mapToAngular(route))
    );
  }

  // ✅ מחיקת מסלול
  
   DeleteTrail(trailId: number): Observable<DeleteTrailResponse> {
    return this.httpClient.delete<DeleteTrailResponse>(
      `${this.API_URL}/Routes/${trailId}`
    );
  }

  // ✅ הוספת מסלול חדש - מתרגם לפני השליחה לשרת
  addTrail(trailData: TrailWithoutId): Observable<Trail> {
    const body = this.mapToSever(trailData);
    return this.httpClient.post<any>(`${this.API_URL}/Routes`, body).pipe(
      map(route => this.mapToAngular(route))
    );
  }

  // ✅ העלאת תמונות למסלול
  uploadImages(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/Routes/upload-images`, formData);
  }

  // ✅ חישוב דירוג ממוצע 
  getAverageRating(ratings: number[]): number {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return Math.round(sum / ratings.length);
  }

  // --- פונקציות המיפוי (המתרגם) ---

  private mapToAngular(serverRoute: any): Trail {
    return {
      id: serverRoute.routeId,
      name: serverRoute.routeName,
      describshain: serverRoute.description,
      regionId: serverRoute.areaId,
      directions: serverRoute.directions,
      RouteLengthInKM: serverRoute.routeLengthKm,
      RouteDuration: serverRoute.routeDuration,
      DifficultyLevel: serverRoute.difficultyLevel,
      minimumAge: serverRoute.minimumAge,
      MaximumAge: serverRoute.maximumAge,
      WetDryTrack: serverRoute.wetDryTrack,
      season: serverRoute.season || [],
      images: serverRoute.images || []
    };
  }

  private mapToSever(angularTrail: any): any {
    return {
      routeId: angularTrail.id,
      routeName: angularTrail.name,
      description: angularTrail.describshain,
      areaId: angularTrail.regionId,
      directions: angularTrail.directions,
      routeLengthKm: angularTrail.RouteLengthInKM,
      routeDuration: angularTrail.RouteDuration,
      difficultyLevel: angularTrail.DifficultyLevel,
      minimumAge: angularTrail.minimumAge,
      maximumAge: angularTrail.MaximumAge,
      wetDryTrack: angularTrail.WetDryTrack,
      season: angularTrail.season,
      images: angularTrail.images
    };
  }
}