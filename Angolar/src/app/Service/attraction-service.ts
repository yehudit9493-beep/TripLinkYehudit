// import { Injectable } from '@angular/core';
// import { Attraction, AttractionWithoutId } from '../Interfacess/attraction';
// import { delay, Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class AttractionService {

//   private readonly USE_MOCK = false;
//   private readonly API_URL = 'https://localhost:7216/api';

//    private MockAttraction: Attraction[] = [
//     // {
//     //   id: 1,
//     //   name: 'מכתש רמון',
//     //   areaId: 8,
//     //   address: 'מצפה רמון',
//     //   type: 'טבע',
//     //   entryFee: 'חינם',
//     //   openingHours: 'כל היום',
//     //   phoneNumber: '08-6588691',
//     //   sabbathKeeper : true,
//     //   description: 'המכתש הגדול בעולם',
//     //   suitableForKids: true,
//     //   images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
//     //     'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500',
//     //     'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500',
//     //   ]
//     // },
//     // {
//     //   id: 2,
//     //   name: 'מוזיאון ישראל',
//     //   areaId: 7,
//     //   address: 'רחוב רופין 11, ירושלים',
//     //   type: 'תרבות',
//     //   entryFee: '60 ₪',
//     //   openingHours: '10:00-17:00',
//     //   phoneNumber: '02-6708811',
//     //   sabbathKeeper : true,
//     //   description: 'המוזיאון הלאומי של ישראל',
//     //   suitableForKids: true,
//     //   images: ['https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop']
//     // },
//     // {
//     //   id: 3,
//     //   name: 'יד ושם',
//     //   areaId: 5,
//     //   address: 'הר הזיכרון, ירושלים',
//     //   type: 'היסטוריה',
//     //   entryFee: 'חינם',
//     //   openingHours: '09:00-17:00',
//     //   phoneNumber: '02-6443400',
//     //   sabbathKeeper : true,
//     //   description: 'מוזיאון השואה הלאומי',
//     //   suitableForKids: false,
//     // },
//     // {
//     //   id: 4,
//     //   name: 'אקווריום ים סוף',
//     //   areaId: 10,
//     //   address: 'קורנית 1, אילת',
//     //   type: 'טבע',
//     //   entryFee: '79 ₪',
//     //   openingHours: '09:00-17:00',
//     //   phoneNumber: '08-6364200',
//     //   sabbathKeeper: false,
//     //   description: 'אקווריום עם דגי ים סוף',
//     //   suitableForKids: true,
//     // },
//   ];

//   constructor(private httpClient: HttpClient) { }

//   //  הבאת כל האטרקציות
//   GetAttraction(): Observable<Attraction[]> {
//     if (this.USE_MOCK) {
//       return of(this.MockAttraction);
//     }
//     return this.httpClient.get<Attraction[]>(`${this.API_URL}/attractions`);
//   }

//   // הבאת אטרקציה בודדת
//   getAttractionById(id: number): Observable<Attraction | undefined> {
//     if (this.USE_MOCK) {
//       const attraction = this.MockAttraction.find(a => a.attractionId === id);
//       return of(attraction);
//     }
//     return this.httpClient.get<Attraction>(`${this.API_URL}/attractions/${id}`);
//   }

//   // עדכון אטרקציה
//   UpdateAttraction(updatedAttraction: Attraction): Observable<Attraction> {
//     if (this.USE_MOCK) {
//       const index = this.MockAttraction.findIndex(a => a.attractionId === updatedAttraction.attractionId);
//       if (index !== -1) {
//         this.MockAttraction[index] = updatedAttraction;
//       }
//       return of(updatedAttraction);
//     }
//     return this.httpClient.put<Attraction>(`${this.API_URL}/attractions/${updatedAttraction.attractionId}`, updatedAttraction);
//   }

//   // מחיקת אטרקציה
//   DeleteAttraction(attractionId: number): Observable<Attraction> {
//     if (this.USE_MOCK) {
//       const index = this.MockAttraction.findIndex(a => a.attractionId === attractionId);
//       if (index !== -1) {
//         const deletedAttraction = this.MockAttraction[index];
//         this.MockAttraction.splice(index, 1);
//         return of(deletedAttraction);
//       }
//       return of({} as Attraction);
//     }
//     return this.httpClient.delete<Attraction>(`${this.API_URL}/attractions/${attractionId}`);
//   }

//   // הוספת אטרקציה חדשה
//   addAttraction(attractionData: AttractionWithoutId): Observable<Attraction> {
//     // if (this.USE_MOCK) {
//     //   const newAttraction: Attraction = {
//     //     id: Math.max(...this.MockAttraction.map(a => a.attractionId)) + 1,
//     //     ...attractionData
//     //   };
//     //   this.MockAttraction.push(newAttraction);
//     //   return of(newAttraction);
//     // }
//     return this.httpClient.post<Attraction>(`${this.API_URL}/attractions`, attractionData);
//   }


//   getAverageRating(ratings: number[]): number {
//     if (ratings.length === 0) return 0;
//     const sum = ratings.reduce((acc, r) => acc + r, 0);
//     return Math.round(sum / ratings.length);
//   }

//   // alias
//   getAttractions(): Observable<Attraction[]> {
//     return this.GetAttraction();
//   }

//   uploadImages(formData: FormData): Observable<any> {
//     if (this.USE_MOCK) {
//       const files: File[] = formData.getAll('images') as File[];
//       const imagePaths: string[] = [];
//       let loadedCount = 0;

//       return new Observable(observer => {
//         files.forEach((file) => {
//           const reader = new FileReader();
//           reader.onload = (event: any) => {
//             imagePaths.push(event.target.result);
//             loadedCount++;

//             if (loadedCount === files.length) {
//               setTimeout(() => {
//                 observer.next({ imagePaths });
//                 observer.complete();
//               }, 500);
//             }
//           };
//           reader.readAsDataURL(file);
//         });
//       });
//     }
//     return this.httpClient.post<any>(`${this.API_URL}/attractions/upload-images`, formData);
//   }
// }


import { Injectable } from '@angular/core';
import { Attraction, AttractionWithoutId } from '../Interfacess/attraction';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Regions } from './regions';

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

  DeleteAttraction(attractionId: number): Observable<Attraction> {
    return this.httpClient.delete<any>(`${this.API_URL}/attractions/${attractionId}`).pipe(
      map(a => this.mapToAngular(a))
    );
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
      
    };
  }
}