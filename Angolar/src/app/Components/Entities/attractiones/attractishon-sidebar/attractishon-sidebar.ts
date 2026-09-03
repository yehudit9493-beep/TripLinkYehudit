import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Attraction } from '../../../../Interfacess/attraction';
import { CommonModule } from '@angular/common';
import { FavoriteItem, FavoriteService } from '../../../../Service/favorite-service';
import { EditAttractions } from '../edit-attractions/edit-attractions';
import { AttractionService } from '../../../../Service/attraction-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDelete } from '../../dialog-delete/dialog-delete';
import { Regions } from '../../../../Service/regions';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RatingService } from '../../../../Service/rating-service';
import { Auth } from '../../../../Service/auth';
import { getCity } from '../../../../Service/city';

@Component({
  selector: 'app-attractishon-sidebar',
  imports: [CommonModule, EditAttractions, FormsModule],
  templateUrl: './attractishon-sidebar.html',
  styleUrl: './attractishon-sidebar.scss',
  standalone: true
})
export class AttractishonSidebar {
  @Input() attraction: Attraction | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() attractionUpdated = new EventEmitter<Attraction>();

  private cityService = inject(getCity);
  cities: any[] = [];

  currentImageIndex: number = 0;

  userRating: number = 0;
  userComment: string = '';
  ratingError: string = '';

  constructor(private favoritesService: FavoriteService,
    private attractionService: AttractionService,
    private dialog: MatDialog,
    private regions: Regions,
    private router: Router,
    private ratingService: RatingService,
    private auth: Auth
  ) { }

  showEdit: boolean = false;

  ngOnInit() {
    this.currentImageIndex = 0;

    this.cityService.getCities().subscribe(data => {
      if (data.success && data.result && Array.isArray(data.result.records)) {
        this.cities = data.result.records.map(record => record.שם_ישוב.trim()).sort();
      } else {
        console.error('No cities found or response is not in expected format:', data);
      }
      console.log(this.cities)
    });
  }

  close() {
    this.closed.emit();
  }

  nextImage() {
    if (this.attraction?.images && this.attraction.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.attraction.images.length;
    }
  }

  prevImage() {
    if (this.attraction?.images && this.attraction.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.attraction.images.length) % this.attraction.images.length;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  getStarsArray(rating: number, maxStars: number = 5): string[] {
    const rounded = Math.round(rating);
    const result: string[] = [];
    for (let i = 1; i <= maxStars; i++) {
      result.push(i <= rounded ? 'full' : 'empty');
    }
    return result;
  }

  toggleFavorite(attraction: Attraction) {
    if (this.isFavorite(attraction)) {
      const item: FavoriteItem = { type: 'attraction', data: attraction };
      this.favoritesService.removeFavorite(item);
    } else {
      const item: FavoriteItem = { type: 'attraction', data: attraction };
      this.favoritesService.addFavorite(item);
    }
  }

  isFavorite(attraction: Attraction): boolean {
    return this.favoritesService.getFavorites().some(
      fav => fav.type === 'attraction' && (fav.data.attractionId ?? fav.data.id) === attraction.attractionId
    );
  }

  onUpdated(updatedAttraction: Attraction) {
    this.attraction = updatedAttraction;
    this.attractionUpdated.emit(updatedAttraction);
    this.showEdit = false;
  }

  deleteAttraction() {
    if (this.attraction) {
      const dialogRef = this.dialog.open(DialogDelete, {
        data: { itemName: this.attraction.attractionName }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.attractionService.DeleteAttraction(this.attraction!.attractionId).subscribe(deletedAttraction => {
            if (deletedAttraction) {
              this.closed.emit();
            }
          });
        }
      });
    }
  }

  getRegionName(regionId: number): string {
    return this.regions.getAreasById(regionId);
  }

  getAverageRating(): number {
    if (!this.attraction) return 0;
    return this.ratingService.getAverageRating('attraction', this.attraction.attractionId);
  }

  goToRatings() {
    this.ratingService.pendingRatingAttractionId = this.attraction!.attractionId;
    this.router.navigate(['/ratings', 'attraction', this.attraction!.attractionId], {
      queryParams: { name: this.attraction!.attractionName }
    });
  }

  setUserRating(star: number) {
    this.userRating = star;
  }

  alreadyRated(): boolean {
    if (!this.attraction) return false;
    return this.ratingService.hasRated('attraction', this.attraction.attractionId, this.auth.getCurrentUserName());
  }

  submitRating() {
    this.ratingError = '';
    const userName = this.auth.getCurrentUserName();

    if (this.ratingService.hasRated('attraction', this.attraction!.attractionId, userName)) {
      this.ratingError = 'כבר דירגת אטרקציה זו';
      return;
    }
    if (this.userRating === 0) { this.ratingError = 'יש לבחור דירוג'; return; }
    if (!this.userComment.trim()) { this.ratingError = 'יש להוסיף הערה'; return; }

    this.ratingService.addRating({
      entityType: 'attraction',
      entityId: this.attraction!.attractionId,
      stars: this.userRating,
      comment: this.userComment.trim(),
      raterName: userName,
      date: new Date()
    });
    this.userRating = 0;
    this.userComment = '';
  }

}
