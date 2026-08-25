// import { Injectable } from '@angular/core';
// import { Accommodation, AccommodationWithoutId } from '../Interfacess/accommodation';
// import { Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class HotelService {
//   private MockHotel: Accommodation[] = [
//     {
//       id: 1,
//       name: 'אכסניית הנוער מצדה',
//       regionId: 8,
//       address: 'מצדה, ים המלח',
//       description: 'אכסניה קרובה למצדה עם נוף מדהים לים המלח',
//       numberOfRooms: 20,
//       numberOfBeds: 40,
//       pricePerNight: 150,
//       Auditorium: true,
//       phoneNumber: '08-6584349',
//       images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
//         'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500',
//         'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500',
//       ]
//     },
//     {
//       id: 2,
//       name: 'קיבוץ עין גדי',
//       regionId: 7,
//       address: 'עין גדי, ים המלח',
//       description: 'מלון בקיבוץ עם גישה לחוף הים המלח',
//       numberOfRooms: 50,
//       numberOfBeds: 100,
//       pricePerNight: 450,
//       Auditorium: false,
//       phoneNumber: '08-6594220',
//     },
//     {
//       id: 3,
//       name: 'צימר גליל עליון',
//       regionId: 3,
//       address: 'ראש פינה',
//       description: 'צימר רומנטי עם נוף לכנרת',
//       numberOfRooms: 5,
//       numberOfBeds: 10,
//       pricePerNight: 600,
//       Auditorium: true,
//       phoneNumber: '04-6934100',
//       images : ['https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop']
//     },
//     {
//       id: 4,
//       name: 'קמפינג חוף דור',
//       regionId: 2,
//       address: 'חוף דור, כרמל',
//       description: 'קמפינג על חוף הים עם מתקני שירות',
//       numberOfRooms: 30,
//       numberOfBeds: 60,
//       pricePerNight: 80,
//       Auditorium: false,
//       phoneNumber: '04-6390760',
//     },
//     {
//       id: 5,
//       name: 'וילה יוקרתית בים המלח',
//       regionId: 2,
//       address: 'חוף דור, כרמל',
//       description: 'וילה משפחתית עם נוף למים, בריכה פרטית ודלקט מושלם',
//       numberOfRooms: 22,
//       numberOfBeds: 44,
//       pricePerNight: 450,
//       phoneNumber: '04-6390760',
//       images: [
//         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1618091215857-d53a97af3e5b?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1615632066742-eff545e96ce0?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
//       ]
//     },
//     {
//       id: 6,
//       name: 'דירה מודרנית בתל אביב',
//       description: 'דירה מעוצבת בעיר, קרוב לחוף ולחיי הלילה',
//       regionId: 6,
//       address: 'תל אביב',
//       pricePerNight: 320,
//       numberOfRooms: 10,
//       numberOfBeds: 20,
//       phoneNumber: '04-6390760',
//       images: [
//         'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1505873242700-f289a29e7e0c?w=800&h=600&fit=crop'
//       ],
//       // amenities: ['WiFi', 'מזגן', 'מטבח', 'חניה תשלום'],
//       // guests: 4
//     },
//     {
//       id: 7,
//       name: 'בית חקלאי בגליל',
//       description: 'חוויה אותנטית בטבע, ירוק טהור ושקט מושלם',
//       regionId: 3,
//       address: 'הגליל',
//       pricePerNight: 280,
//       numberOfRooms: 8,
//       numberOfBeds: 16,
//       phoneNumber: '04-6390760',
//       images: [
//         'https://images.unsplash.com/photo-1564078369132-1a7f3d90d1b1?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1516156008625-3a9995f80fbf?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=800&h=600&fit=crop'
//       ],
//       // amenities: ['WiFi', 'חצר', 'ברביקיו', 'בריכה'],
//       // guests: 8
//     },
//     {
//       id: 4,
//       name: 'בוטיק הוטל בירושלים',
//       description: 'הוטל בוטיק בעיר העתיקה, עם אתמוספירה מיוחדת',
//       regionId: 5,
//       address: 'ירושלים',
//       pricePerNight: 380,
//       numberOfRooms: 8,
//       numberOfBeds: 16,
//       phoneNumber: '04-6390760',
//       images: [
//         'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1559599810-46d1c9fdc128?w=800&h=600&fit=crop'
//       ],
//       // amenities: ['WiFi', 'סאונה', 'מסעדה', 'חדר כושר'],
//     },
//     {
//       id: 5,
//       name: 'קיבוץ עם תנאים ירוקים',
//       regionId: 4,
//       description: 'אירוח בקיבוץ עם חברה וחיים קהילתיים',
//       address: 'אזור מרכז',
//       pricePerNight: 200,
//       numberOfRooms: 12,
//       numberOfBeds: 60,
//       Auditorium: false,
//       phoneNumber: '04-6390760',
//       images: [
//         'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=800&h=600&fit=crop',
//         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
//       ],
//       // amenities: ['WiFi', 'מטבח משותף', 'חדר ישיבות', 'בריכה'],
//     }
//   ];

//   constructor (private httpClient: HttpClient){}

//   GetTrail(): Observable<Accommodation[]> {
//     return of(this.MockHotel)
//   }

//   getAverageRating(ratings: number[]): number {
//     if (ratings.length === 0) return 0;
//     const sum = ratings.reduce((acc, r) => acc + r, 0);
//     return Math.round(sum / ratings.length); // ← עיגול למספר שלם
//   }

//   UpdateHotel(updatedHotel: Accommodation): Observable<Accommodation> {
//     // מוק — מעדכן את המערך המקומי
//     const index = this.MockHotel.findIndex(t => t.id === updatedHotel.id);
//     if (index !== -1) {
//       this.MockHotel[index] = updatedHotel;
//     }
//     return of(updatedHotel);

//     // כשתתחברי לשרת — תחליפי את השורות למעלה בזה:
//     //return this.httpClient.put<Accommodation>(`https://your-api/trails/${updatedTrail.id}`, updatedTrail);
//   }

//   DeleteHotel(hotelId: number): Observable<Accommodation> {
//     const index = this.MockHotel.findIndex(t => t.id === hotelId);
//     if (index !== -1) {
//       const deletedhotel = this.MockHotel[index];
//       this.MockHotel.splice(index, 1);
//       return of(deletedhotel);
//     }
//     return of({} as Accommodation);
//   }

//   addHotel(hotelData: AccommodationWithoutId) {
//     const newHotel: Accommodation = {
//       id: this.MockHotel.length + 1, // ID זמני למוק
//       ...hotelData
//     };
//     this.MockHotel.push(newHotel);
//     return of({ success: true, message: 'מקום הלינה נוסף בהצלחה', data: newHotel });
//   }

//   getHotels() {
//     return of(this.MockHotel); // החזרת המלונות
//   }

// }


import { Injectable } from '@angular/core';
import { Accommodation, AccommodationWithoutId } from '../Interfacess/accommodation';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Regions } from './regions';

@Injectable({
  providedIn: 'root',
})
export class HotelService {

  private readonly API_URL = 'https://localhost:7216/api';

  constructor(private httpClient: HttpClient, private regionsService: Regions) { }

  // ✅ הבאת כל מקומות הלינה - מתורגמים לאנגולר
  GetTrail(): Observable<Accommodation[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/Hotels`).pipe(
      map(serverLodgings => serverLodgings.map(l => this.mapToAngular(l)))
    );
  }

  getHotels(): Observable<Accommodation[]> {
    return this.GetTrail();
  }

  // ✅ הבאת מקום לינה בודד לפי מזהה
  getHotelById(id: number): Observable<Accommodation> {
    return this.httpClient.get<any>(`${this.API_URL}/Hotels/${id}`).pipe(
      map(l => this.mapToAngular(l))
    );
  }

  // ✅ חישוב דירוג ממוצע
  getAverageRating(ratings: number[]): number {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return Math.round(sum / ratings.length);
  }

  // ✅ עדכון מקום לינה קיים
  UpdateHotel(updatedHotel: Accommodation): Observable<Accommodation> {
    const body = this.mapToSever(updatedHotel);
    return this.httpClient.put<any>(`${this.API_URL}/Hotels/${updatedHotel.id}`, body).pipe(
      map(l => this.mapToAngular(l))
    );
  }

  // ✅ מחיקת מקום לינה
  DeleteHotel(hotelId: number): Observable<Accommodation> {
    return this.httpClient.delete<any>(`${this.API_URL}/Hotels/${hotelId}`).pipe(
      map(l => this.mapToAngular(l))
    );
  }

  // ✅ הוספת מקום לינה חדש
  addHotel(hotelData: AccommodationWithoutId): Observable<Accommodation> {
    const body = this.mapToSever(hotelData);
    return this.httpClient.post<any>(`${this.API_URL}/Hotels`, body).pipe(
      map(l => this.mapToAngular(l))
    );
  }

  // --- פונקציות המיפוי ---

  private mapToAngular(server: any): Accommodation {
    return {
      id: server.lodgingId,
      name: server.lodgingName,
      regionId: server.areaId,
      address: server.address,
      description: server.description,
      numberOfRooms: server.numOfRooms,
      numberOfBeds: server.numOfBeds,
      pricePerNight: server.pricePerNight,
      phoneNumber: server.phonNumber,
      Auditorium: server.auditorium,
      Kashrut: server.kashrut,
      images: [],
      city : server.city
    };
  }

  private mapToSever(hotel: any): any {
    return {
      lodgingId: hotel.id,
      lodgingName: hotel.name,
      areaId: hotel.regionId,
      areaName: this.regionsService.getAreasById(hotel.regionId),
      address: hotel.address,
      description: hotel.description,
      numOfRooms: hotel.numberOfRooms,
      numOfBeds: hotel.numberOfBeds,
      pricePerNight: hotel.pricePerNight,
      phonNumber: hotel.phoneNumber,
      auditorium: hotel.Auditorium,
      kashrut: hotel.Kashrut,
      city : hotel.city
    };
  }
}