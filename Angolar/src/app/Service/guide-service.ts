import { Injectable } from '@angular/core';
import { Guides } from '../Interfacess/guides';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface DeleteGuideResponse {
  isSuccess: boolean;
  message: string;
  guideId: number;
  rowsAffected: number;
  deletedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class GuideService {

  private readonly USE_MOCK = false;
  private readonly API_URL = 'https://localhost:7216/api';

  constructor(private httpClient: HttpClient) { }

  // שליפת כל המדריכות מהשרת
  GetGuide(): Observable<Guides[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/Guide`).pipe(
      map(guides => guides.map(g => this.mapToAngular(g)))
    );
  }

  getGuids(): Observable<Guides[]> {
    return this.GetGuide();
  }

  // עדכון מדריכה בשרת
  UpdateGuide(updatedGuide: Guides): Observable<Guides> {
    const body = this.mapToSever(updatedGuide);
    return this.httpClient.put<any>(`${this.API_URL}/Guide/${updatedGuide.id}`, body).pipe(
      map(g => this.mapToAngular(g))
    );
  }

  // מחיקת מדריכה בשרת
  DeleteGuide(guideId: number): Observable<DeleteGuideResponse> {
    return this.httpClient.delete<DeleteGuideResponse>(`${this.API_URL}/Guide/${guideId}`);
  }

  // --- פונקציות המיפוי (המתרגם בין Angular לשרת) ---

  private mapToAngular(serverGuide: any): Guides {
    return {
      id: serverGuide.guideId,
      name: serverGuide.name,
      trainingRegionsId: serverGuide.trainingAreas || [],
      licenseNumber: serverGuide.licenseNumber || '',
      phoneNumber: serverGuide.phoneNumber || '',
      email: serverGuide.email || '',
      specialization: serverGuide.specialization,
      yearsOfExperience: serverGuide.yearsOfExperience,
      status: serverGuide.status,
      ReligiousAffiliation: serverGuide.religiousName || ''
    };
  }

  private mapToSever(angularGuide: Guides): any {
    return {
      name: angularGuide.name,
      trainingAreas: angularGuide.trainingRegionsId,
      licenseNumber: angularGuide.licenseNumber,
      phoneNumber: angularGuide.phoneNumber,
      email: angularGuide.email,
      specialization: angularGuide.specialization,
      yearsOfExperience: angularGuide.yearsOfExperience,
      status: angularGuide.status,
      religiousName: angularGuide.ReligiousAffiliation
    };
  }
}
