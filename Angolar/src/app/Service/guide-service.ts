import { Injectable } from '@angular/core';
import { Guides, GuideWithoutId } from '../Interfacess/guides';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuideService {

  private MockGuide: Guides[] = [
    {
      id: 1,
      name: 'מיכל כהן',
      trainingRegionsId:[1,2],
      licenseNumber: 'MK-1234',
      phoneNumber: '050-1234567',
      email: 'michal@guides.co.il',
      specialization: 'טיולי טבע',
      yearsOfExperience: 8,
      status: true,
      ReligiousAffiliation: 'חסידי'
    },
    {
      id: 2,
      name: 'דוד לוי',
      trainingRegionsId:[ 7,8],
      licenseNumber: 'DL-5678',
      phoneNumber: '052-9876543',
      email: 'david@guides.co.il',
      specialization: 'מדבר ונגב',
      yearsOfExperience: 12,
      status: false,
      ReligiousAffiliation: 'לטאי'
    },
    {
      id: 3,
      name: 'שרה אברהם',
      trainingRegionsId: [4],
      licenseNumber: 'SA-9012',
      phoneNumber: '054-4561234',
      email: 'sara@guides.co.il',
      specialization: 'אתרים היסטוריים',
      yearsOfExperience: 5,
      status: true,
      ReligiousAffiliation: 'ספרדי'
    },
    {
      id: 4,
      name: 'יוסי ברק',
      trainingRegionsId: [2,3],
      licenseNumber: 'YB-3456',
      phoneNumber: '053-7891234',
      email: 'yossi@guides.co.il',
      specialization: 'טיולי כנרת וגולן',
      yearsOfExperience: 15,
      status: true,
      ReligiousAffiliation: 'אשכנזי'
    },
  ];

  GetGuide(): Observable<Guides[]> {
    return of(this.MockGuide)
  }

  getAverageRating(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return Math.round(sum / ratings.length); // ← עיגול למספר שלם
  }

  UpdateGuide(updatedGuide: Guides): Observable<Guides> {
    // מוק — מעדכן את המערך המקומי
    const index = this.MockGuide.findIndex(t => t.id === updatedGuide.id);
    if (index !== -1) {
      this.MockGuide[index] = updatedGuide;
    }
    return of(updatedGuide);

    // כשתתחברי לשרת — תחליפי את השורות למעלה בזה:
    // return this.httpClient.put<Trail>(`https://your-api/trails/${updatedTrail.id}`, updatedTrail);
  }

  DeleteGuide(guideId: number): Observable<Guides> {
    const index = this.MockGuide.findIndex(t => t.id === guideId);
    if (index !== -1) {
      const deletedGuide = this.MockGuide[index];
      this.MockGuide.splice(index, 1);
      return of(deletedGuide);
    }
    return of({} as Guides);
  }

   addGuide(guideData: GuideWithoutId) {
    const newGuide: Guides = {
      id: this.MockGuide.length + 1, // ID זמני למוק
      ...guideData
    };
    this.MockGuide.push(newGuide);
    return of({ success: true, message: 'המדריכה נוספה בהצלחה', data: newGuide });
  }
  
    getGuids() {
      return of(this.MockGuide); // החזרת המדריכים
    }
}
