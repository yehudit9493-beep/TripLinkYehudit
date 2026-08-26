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

  // הוספת פריט למועדפים
  addFavorite(item: FavoriteItem) {
    this.favorites.push(item);
  }

  // הסרת פריט מהמועדפים
  removeFavorite(item: FavoriteItem) {
    this.favorites = this.favorites.filter(
      fav => !(fav.type === item.type && fav.data.id === item.data.id)
    );
  }
  // קבלת כל המועדפים
  getFavorites(): FavoriteItem[] {
    return this.favorites;
  }
}
