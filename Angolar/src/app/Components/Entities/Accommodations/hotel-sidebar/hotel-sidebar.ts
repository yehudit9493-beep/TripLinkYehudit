import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Accommodation } from '../../../../Interfacess/accommodation';
import { CommonModule } from '@angular/common';
import { FavoriteItem, FavoriteService } from '../../../../Service/favorite-service';
import { EditHotel } from '../edit-hotel/edit-hotel';
import { HotelService } from '../../../../Service/hotel-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDelete } from '../../dialog-delete/dialog-delete';
import { Regions } from '../../../../Service/regions';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RatingService } from '../../../../Service/rating-service';
import { Auth } from '../../../../Service/auth';

@Component({
  selector: 'app-hotel-sidebar',
  imports: [CommonModule, EditHotel, FormsModule],
  templateUrl: './hotel-sidebar.html',
  styleUrl: './hotel-sidebar.scss',
  standalone: true
})
export class HotelSidebar {
  @Input() hotel: Accommodation | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() hotelUpdated = new EventEmitter<Accommodation>();

  showEdit: boolean = false;

  currentImageIndex: number = 0;

  userRating: number = 0;
  userComment: string = '';
  ratingError: string = '';

  nextImage() {
    if (this.hotel?.images && this.hotel.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.hotel.images.length;
    }
  }

  prevImage() {
    if (this.hotel?.images && this.hotel.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.hotel.images.length) % this.hotel.images.length;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  ngOnInit() {
    this.currentImageIndex = 0;
  }

  constructor(private favoritesService: FavoriteService,
    private hotelService: HotelService,
    private dialog: MatDialog,
    private regions: Regions,
    private router: Router,
    private ratingService: RatingService,
    private auth: Auth
  ) { }

  close() {
    this.closed.emit();
  }

  getStarsArray(rating: number, maxStars: number = 5): string[] {
    const rounded = Math.round(rating);
    const result: string[] = [];
    for (let i = 1; i <= maxStars; i++) {
      result.push(i <= rounded ? 'full' : 'empty');
    }
    return result;
  }

  toggleFavorite(hotel: Accommodation) {
    if (this.isFavorite(hotel)) {
      const item: FavoriteItem = { type: 'accommodation', data: hotel };
      this.favoritesService.removeFavorite(item);
    } else {
      const item: FavoriteItem = { type: 'accommodation', data: hotel };
      this.favoritesService.addFavorite(item);
    }
  }

  isFavorite(hotel: Accommodation): boolean {
    return this.favoritesService.getFavorites().some(
      fav => fav.type === 'accommodation' && fav.data.id === hotel.id
    );
  }

  onUpdated(updatedHotel: Accommodation) {
    this.hotel = updatedHotel;
    this.hotelUpdated.emit(updatedHotel);
    this.showEdit = false;
  }

  deleteHotel() {
    if (this.hotel) {
      const dialogRef = this.dialog.open(DialogDelete, {
        data: { itemName: this.hotel.name }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.hotelService.DeleteHotel(this.hotel!.id).subscribe(deletedHotel => {
            if (deletedHotel) {
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
    if (!this.hotel) return 0;
    return this.ratingService.getAverageRating('accommodation', this.hotel.id);
  }

  goToRatings() {
    this.ratingService.pendingRatingHotelId = this.hotel!.id;
    this.router.navigate(['/ratings', 'accommodation', this.hotel!.id], {
      queryParams: { name: this.hotel!.name }
    });
  }

  setUserRating(star: number) {
    this.userRating = star;
  }

  alreadyRated(): boolean {
    if (!this.hotel) return false;
    return this.ratingService.hasRated('accommodation', this.hotel.id, this.auth.getCurrentUserName());
  }

  submitRating() {
    this.ratingError = '';
    const userName = this.auth.getCurrentUserName();

    if (this.ratingService.hasRated('accommodation', this.hotel!.id, userName)) {
      this.ratingError = 'כבר דירגת מקום לינה זה';
      return;
    }
    if (this.userRating === 0) { this.ratingError = 'יש לבחור דירוג'; return; }
    if (!this.userComment.trim()) { this.ratingError = 'יש להוסיף הערה'; return; }

    this.ratingService.addRating({
      entityType: 'accommodation',
      entityId: this.hotel!.id,
      stars: this.userRating,
      comment: this.userComment.trim(),
      raterName: userName,
      date: new Date()
    });
    this.userRating = 0;
    this.userComment = '';
  }

}
