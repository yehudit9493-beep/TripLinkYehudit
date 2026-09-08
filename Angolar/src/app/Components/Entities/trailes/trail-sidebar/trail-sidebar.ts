import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Trail } from '../../../../Interfacess/Trail';
import { CommonModule } from '@angular/common';
import { FavoriteItem, FavoriteService } from '../../../../Service/favorite-service';
import { EditTrail } from '../edit-trail/edit-trail';
import { TrailsService } from '../../../../Service/TrailsService';
import { MatDialog } from '@angular/material/dialog';
import { DialogDelete } from '../../dialog-delete/dialog-delete';
import { Regions } from '../../../../Service/regions';
import { Router } from '@angular/router';
import { RatingService } from '../../../../Service/rating-service';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../../Service/auth';

@Component({
  selector: 'app-trail-sidebar',
  imports: [CommonModule, EditTrail, FormsModule],
  templateUrl: './trail-sidebar.html',
  styleUrl: './trail-sidebar.scss',
  standalone: true
})
export class TrailSidebar {

  @Input() trail: Trail | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() trailUpdated = new EventEmitter<Trail>();

  showEdit: boolean = false;

  currentImageIndex: number = 0;

  constructor(private favoritesService: FavoriteService,
    private trailsService: TrailsService,
    private dialog: MatDialog,
    private regions: Regions,
    private router: Router,
    private ratingService: RatingService,
    private auth: Auth) { }


  ngOnInit() {
    this.currentImageIndex = 0;
    this.loadRating();
  }

  // טעינת ממוצע הדירוגים ובדיקה אם המשתמש כבר דירג - עבור המסלול הנוכחי
  loadRating() {
    if (!this.trail) return;
    this.ratingService.getAverageRating('trail', this.trail.id).subscribe({
      next: avg => this.avgRating = avg
    });
    this.ratingService.hasRated('trail', this.trail.id, this.auth.getCurrentUserId()).subscribe({
      next: rated => this.rated = rated
    });
  }

  close() {
    this.closed.emit();
  }

  nextImage() {
    if (this.trail?.images && this.trail.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.trail.images.length;
    }
  }

  prevImage() {
    if (this.trail?.images && this.trail.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.trail.images.length) % this.trail.images.length;
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

  toggleFavorite(trail: Trail) {
    if (this.isFavorite(trail)) {
      const item: FavoriteItem = { type: 'Trail', data: trail };
      this.favoritesService.removeFavorite(item);
    } else {
      const item: FavoriteItem = { type: 'Trail', data: trail };
      this.favoritesService.addFavorite(item);
    }
  }

  isFavorite(trail: Trail): boolean {
    return this.favoritesService.getFavorites().some(
      fav => fav.type === 'Trail' && fav.data.id === trail.id
    );
  }

  onUpdated(updatedTrail: Trail) {
    this.trail = updatedTrail;
    this.trailUpdated.emit(updatedTrail);
    this.showEdit = false;
  }

  deleteTrail() {
    if (this.trail) {
      const dialogRef = this.dialog.open(DialogDelete, {
        data: { itemName: this.trail.name }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.trailsService.DeleteTrail(this.trail!.id).subscribe(deletedTrail => {
            if (deletedTrail) {
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

  userRating: number = 0;
  userComment: string = '';
  ratingError: string = '';

  // נתוני הדירוג של המסלול הנוכחי (נטענים מהשרת ב-ngOnInit)
  avgRating: number = 0;
  rated: boolean = false;

  getAverageRating(): number {
    return this.avgRating;
  }

  goToRatings() {
    this.ratingService.pendingRatingTrailId = this.trail!.id;
    this.router.navigate(['/ratings', 'trail', this.trail!.id], {
      queryParams: { name: this.trail!.name }
    });
  }

  setUserRating(star: number) {
    this.userRating = star;
  }

  submitRating() {
    this.ratingError = '';

    if (this.rated) {
      this.ratingError = 'כבר דירגת מסלול זה';
      return;
    }

    if (this.userRating === 0) { this.ratingError = 'יש לבחור דירוג'; return; }
    if (!this.userComment.trim()) { this.ratingError = 'יש להוסיף הערה'; return; }

    this.ratingService.addRating({
      entityType: 'trail', entityId: this.trail!.id,
      stars: this.userRating, comment: this.userComment.trim(),
      raterName: this.auth.getCurrentUserName(), date: new Date()
    }, this.auth.getCurrentUserId()).subscribe({
      next: () => {
        this.rated = true;
        this.ratingError = '';
        this.ratingService.getAverageRating('trail', this.trail!.id).subscribe({
          next: avg => this.avgRating = avg
        });
      },
      error: (err) => {
        this.ratingError = err?.error?.message ?? 'שגיאה בשמירת הדירוג';
      }
    });
    this.userRating = 0;
    this.userComment = '';
  }

  alreadyRated(): boolean {
    return this.rated;
  }

}
