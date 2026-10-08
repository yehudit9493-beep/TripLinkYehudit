import { Injectable } from '@angular/core';
import { Guides } from '../Interfacess/guides';
import { Subject } from 'rxjs';
import { Trail } from '../Interfacess/Trail';
import { Attraction } from '../Interfacess/attraction';
import { Accommodation } from '../Interfacess/accommodation';
import { Auth } from './auth';

export type FavoriteItem = {
  type: 'guides' | 'Trail' | 'attraction' | 'accommodation';
  data: any;
};

type ServerFavorite = {
  itemType: string;
  itemId: number;
  addedDate?: string;
};

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {

  private favorites: FavoriteItem[] = [];

  // מפתח ה-localStorage שבו נשמרת רשימת המועדפים (כולל הנתונים המלאים)
  // כך שהפריטים ישרדו רענון דף, ובמקביל נסנכרן עם השרת לשמירה מתמשכת.
  private readonly STORAGE_KEY = 'favorites';

  private readonly API_URL = 'https://localhost:7216/api/Favorite';

  // דגל המבטיח שטעינת המועדפים מהשרת תבוצע רק פעם אחת
  private loaded = false;

  openGuide$ = new Subject<Guides>();
  openTrail$ = new Subject<Trail>();
  openAttraction$ = new Subject<Attraction>();
  openAccommodation$ = new Subject<Accommodation>();


  pendingGuide: Guides | null = null;
  pendingTrail: Trail | null = null;
  pendingAttraction: Attraction | null = null;
  pendingAccommodation: Accommodation | null = null;

  constructor(private auth: Auth) {
    // אחזור ראשוני של המועדפים שנשמרו מקומית (מהפעלה קודמת)
    this.favorites = this.readFromLocalStorage();
  }

  // החזרת המזהה הייחודי של כל ישות בהתאם לסוגה
  // (Attraction משתמש ב-attractionId, שאר הישויות ב-id)
  private getItemId(item: FavoriteItem): any {
    return item.data?.id ?? item.data?.attractionId;
  }

  private get userId(): number {
    return this.auth.getCurrentUserId();
  }

  // הרשאות גישה (Bearer token) - נשלח בכל בקשה לשרת
  private authHeaders(): Record<string, string> {
    const saved = localStorage.getItem('currentUser');
    let token = '';
    if (saved) {
      try {
        const user = JSON.parse(saved);
        token = user?.token ? String(user.token) : '';
      } catch {
        token = '';
      }
    }
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // נרמול סוג הישות לאותיות קטנות (תואם לאחסון בשרת)
  private normalizeType(type: string): string {
    return (type || '').trim().toLowerCase();
  }

  // המרת מחרוזת (שמגיעה מהשרת) לסוג מועדף תקין, או null אם אינו מוכר.
  // נעשה שימוש כדי לסנן ערכים לא חוקיים בעת טעינת הנתונים מהשרת.
  private mapServerType(type: string): FavoriteItem['type'] | null {
    switch (this.normalizeType(type)) {
      case 'guides': return 'guides';
      case 'trail': return 'Trail';
      case 'attraction': return 'attraction';
      case 'accommodation': return 'accommodation';
      default: return null;
    }
  }

  // משקולת אחסון מקומי ייחודית לסוג+מזהה
  private storageKey(type: string, id: any): string {
    return `${this.normalizeType(type)}:${id}`;
  }

  // לוגיקה נפוצה: טעינת פריטים מהשרת ושילובם עם הנתונים המלאים המקומיים
  loadFavoritesFromServer(): void {
    this.loaded = true;

    // שומרים את הנתונים המלאים הקיימים כדי להשלים את אלו שמגיעים מהשרת
    const localData = new Map<string, any>();
    for (const fav of this.favorites) {
      localData.set(this.storageKey(fav.type, this.getItemId(fav)), fav.data);
    }

    fetch(this.API_URL, { headers: this.authHeaders() })
      .then(res => (res.ok ? res.json() : [] as ServerFavorite[]))
      .then((rows: ServerFavorite[]) => {
        const merged: FavoriteItem[] = [];
        const seen = new Set<string>();

        for (const row of rows ?? []) {
          const type = this.mapServerType(row.itemType);
          if (!type) continue; // סוג שאינו מוכר - מדלגים

          const id = row.itemId;
          const key = this.storageKey(type, id);
          if (seen.has(key)) continue;

          // העדפה לנתונים המלאים שבידינו (מ-localStorage), אחרת רק מזהה
          const data = localData.get(key) ?? { id };
          merged.push({ type, data });
          seen.add(key);
        }

        // פריטים מקומיים שאינם עוד בשרת (הוסרו במכשיר אחר) - שומרים אותם
        for (const fav of this.favorites) {
          const key = this.storageKey(fav.type, this.getItemId(fav));
          if (!seen.has(key)) {
            merged.push(fav);
            seen.add(key);
          }
        }

        this.favorites = merged;
        this.persistLocal();
      })
      .catch(() => {
        // כשל בתקשורת עם השרת - ממשיכים עם הנתונים המקומיים הקיימים
      });
  }

  // טעינת המועדפים בעת הצורך - פעם אחת בלבד לכל הפעלת אפליקציה
  private ensureLoadedOnce(): void {
    if (this.loaded) return;
    this.loadFavoritesFromServer();
  }

  // הוספת פריט למועדפים
  addFavorite(item: FavoriteItem) {
    // מניעת כפילות מקומית
    if (!this.favorites.some(
      fav => fav.type === item.type && this.getItemId(fav) === this.getItemId(item))) {
      this.favorites.push(item);
      this.persistLocal();
    }

    // שליחה לשרת (השרת מונע כפילות גם כן)
    fetch(this.API_URL, {
      method: 'POST',
      headers: { ...this.authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemType: item.type,
        itemId: this.getItemId(item),
      }),
    }).catch(() => { /* כשל התקשורת - הפריט נשמר לפחות מקומית */ });
  }

  // הסרת פריט מהמועדפים
  removeFavorite(item: FavoriteItem) {
    const id = this.getItemId(item);
    this.favorites = this.favorites.filter(
      fav => !(fav.type === item.type && this.getItemId(fav) === id)
    );
    this.persistLocal();

    // שליחה לשרת
    fetch(this.API_URL, {
      method: 'DELETE',
      headers: { ...this.authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemType: item.type,
        itemId: id,
      }),
    }).catch(() => { /* כשל התקשורת - הפריט הוסר לפחות מקומית */ });
  }

  // קבלת כל המועדפים (סינכרוני לשימוש בתבניות ובפאנל)
  getFavorites(): FavoriteItem[] {
    this.ensureLoadedOnce();
    return this.favorites;
  }

  // בדיקה אם פריט נמצא במועדפים
  exists(item: FavoriteItem): boolean {
    return this.favorites.some(
      fav => fav.type === item.type && this.getItemId(fav) === this.getItemId(item)
    );
  }

  // ניקוי כל המועדפים (גם מקומית וגם בשרת)
  clearFavorites(): void {
    this.favorites = [];
    this.removeLocalStorage();

    fetch(`${this.API_URL}/clear`, {
      method: 'DELETE',
      headers: this.authHeaders(),
    }).catch(() => { /* כשל התקשורת - המועדפים נוקו לפחות מקומית */ });
  }

  // ---------------------------------------------
  // אחסון מקומי של הנתונים המלאים
  // ---------------------------------------------

  private persistLocal(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
    } catch {
      // localStorage מלא/חסום - המועדפים נשמרים בזיכרון בלבד
    }
  }

  private readFromLocalStorage(): FavoriteItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private removeLocalStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // אין מה לעשות - נרוקן לפחות את המערך
    }
  }
}
