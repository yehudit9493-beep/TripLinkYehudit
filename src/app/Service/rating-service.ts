import { Injectable } from '@angular/core';

export interface Rating {
  entityType: 'trail' | 'attraction' | 'guide' | 'accommodation';
  entityId: number;
  stars: number;
  comment: string;
  raterName: string;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class RatingService {

  pendingRatingTrailId: number | null = null;
  pendingRatingAttractionId: number | null = null;
  pendingRatingGuideId: number | null = null;
  pendingRatingHotelId: number | null = null;

  private ratings: Rating[] = [{
    entityType: 'trail', entityId: 1,
    stars: 5, comment: 'מסלול מדהים, ממליצה בחום!',
    raterName: 'יהודית', date: new Date('2024-03-01')
  },
  {
    entityType: 'trail', entityId: 1,
    stars: 4, comment: 'יפה מאוד, קצת קשה לילדים קטנים',
    raterName: 'חני', date: new Date('2024-05-15')
  },];

  addRating(rating: Rating) {
    this.ratings.push(rating);
  }

  getRatings(entityType: string, entityId: number): Rating[] {
    return this.ratings.filter(
      r => r.entityType === entityType && r.entityId === entityId
    );
  }

  getAverageRating(entityType: string, entityId: number): number {
    const relevant = this.getRatings(entityType, entityId);
    if (relevant.length === 0) return 0;
    const sum = relevant.reduce((acc, r) => acc + r.stars, 0);
    return sum / relevant.length;
  }

  hasRated(entityType: string, entityId: number, userName: string): boolean {
    return this.ratings.some(
      r => r.entityType === entityType && r.entityId === entityId && r.raterName === userName
    );
  }

  getStarsArray(rating: number, maxStars: number = 5): string[] {
    const rounded = Math.round(rating);
    return Array.from({ length: maxStars }, (_, i) => i < rounded ? 'full' : 'empty');
  }

}