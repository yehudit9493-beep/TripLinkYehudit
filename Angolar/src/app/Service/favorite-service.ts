import { EventEmitter, Injectable } from '@angular/core';
import { Guides } from '../Interfacess/guides';
import { Subject } from 'rxjs';
import { Trail } from '../Interfacess/Trail';
import { Attraction } from '../Interfacess/attraction';
import { Accommodation } from '../Interfacess/accommodation';

export type FavoriteItem = {
  type: 'guides' | 'Trail' | 'attraction' | 'accommodation';
  data: any;
};

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {

  private favorites: FavoriteItem[] = [];

  openGuide$ = new Subject<Guides>();
  openTrail$ = new Subject<Trail>();
  openAttraction$ = new Subject<Attraction>();
  openAccommodation$ = new Subject<Accommodation>();


  pendingGuide: Guides | null = null;
  pendingTrail: Trail | null = null;
  pendingAttraction: Attraction | null = null;
  pendingAccommodation: Accommodation | null = null;

  // החזרת המזהה הייחודי של כל ישות בהתאם לסוגה
  // (Attraction משתמש ב-attractionId, שאר הישויות ב-id)
  private getItemId(item: FavoriteItem): any {
    return item.data?.id ?? item.data?.attractionId;
  }

  // הוספת פריט למועדפים
  addFavorite(item: FavoriteItem) {
    this.favorites.push(item);
  }

  // הסרת פריט מהמועדפים
  removeFavorite(item: FavoriteItem) {
    const id = this.getItemId(item);
    this.favorites = this.favorites.filter(
      fav => !(fav.type === item.type && this.getItemId(fav) === id)
    );
  }
  // קבלת כל המועדפים
  getFavorites(): FavoriteItem[] {
    return this.favorites;
  }
}
