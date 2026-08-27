
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