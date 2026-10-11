import { Injectable } from '@angular/core';
import { Attraction, AttractionWithoutId } from '../Interfacess/attraction';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Regions } from './regions';

export interface DeleteAttractionResponse {
  isSuccess: boolean;
  message: string;
  attractionId: number;
  rowsAffected: number;
  deletedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AttractionService {

  private readonly API_URL = 'https://localhost:7216/api';

  constructor(private httpClient: HttpClient, private regionsService: Regions) { }

  GetAttraction(): Observable<Attraction[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/attractions`).pipe(
      map(list => list.map(a => this.mapToAngular(a)))
    );
  }

  // הבאת האזורים מה-DB (למילוי ה-select). מחזיר {id, name} לצרכי הטופס.
  GetAreas(): Observable<{ id: number, name: string }[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/attractions/areas`).pipe(
      map(list => list.map(a => ({ id: a.areaId, name: a.areaName })))
    );
  }

  // הבאת סוגי האטרקציות מה-DB (למילוי ה-select). מחזיר {id, name}.
  GetTypes(): Observable<{ id: number, name: string }[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/attractions/types`).pipe(
      map(list => list.map(t => ({ id: t.typeId, name: t.typeName })))
    );
  }

  getAttractionById(id: number): Observable<Attraction> {
    return this.httpClient.get<any>(`${this.API_URL}/attractions/${id}`).pipe(
      map(a => this.mapToAngular(a))
    );
  }

  UpdateAttraction(updatedAttraction: Attraction): Observable<Attraction> {
    const body = this.mapToSever(updatedAttraction);
    return this.httpClient.put<any>(`${this.API_URL}/attractions/${updatedAttraction.attractionId}`, body).pipe(
      map(a => this.mapToAngular(a))
    );
  }

  DeleteAttraction(attractionId: number): Observable<DeleteAttractionResponse> {
    return this.httpClient.delete<DeleteAttractionResponse>(`${this.API_URL}/attractions/${attractionId}`);
  }

  addAttraction(attractionData: AttractionWithoutId): Observable<Attraction> {
    const body = this.mapToSever(attractionData);
    return this.httpClient.post<any>(`${this.API_URL}/attractions`, body).pipe(
      map(a => this.mapToAngular(a))
    );
  }

  getAverageRating(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return Math.round(sum / ratings.length);
  }

  getAttractions(): Observable<Attraction[]> {
    return this.GetAttraction();
  }

  uploadImages(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/attractions/upload-images`, formData);
  }

  // --- מיפוי ---

  private mapToAngular(server: any): Attraction {
    return {
      attractionId: server.attractionId,
      attractionName: server.attractionName,
      areaId: server.areaId,
      address: server.address,
      typeName: server.typeName,
      sabbathKeeper: server.sabbatKipper,
      entryFee: server.entryFee,
      openingHours: server.openingHours,
      phoneNumber: server.phoneNumber,
      description: server.description,
      suitableForKids: server.suitableForKids,
      images: server.images || [],
      city: server.city,
    };
  }

  private mapToSever(attraction: any): any {
    return {
      attractionId: attraction.attractionId,
      attractionName: attraction.attractionName,
      areaId: attraction.areaId,
      areaName: this.regionsService.getAreasById(attraction.areaId),
      address: attraction.address,
      city: attraction.city || '',
      typeName: attraction.typeName,
      sabbatKipper: attraction.sabbathKeeper,
      entryFee: attraction.entryFee,
      openingHours: attraction.openingHours,
      phoneNumber: attraction.phoneNumber,
      description: attraction.description,
      suitableForKids: attraction.suitableForKids,
      images: attraction.images || []
    };
  }
}