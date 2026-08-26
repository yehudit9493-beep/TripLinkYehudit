import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Guides } from '../../../../Interfacess/guides';
import { CommonModule } from '@angular/common';
import { FavoriteItem, FavoriteService } from '../../../../Service/favorite-service';
import { ButtonModule } from 'primeng/button';
import { EditGuide } from '../edit-guide/edit-guide';
import { GuideService } from '../../../../Service/guide-service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDelete } from '../../dialog-delete/dialog-delete';
import { Regions } from '../../../../Service/regions';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RatingService } from '../../../../Service/rating-service';
import { Auth } from '../../../../Service/auth';

@Component({
  selector: 'app-guide-sidebar',
  imports: [CommonModule, ButtonModule, EditGuide, RouterLink, FormsModule],
  templateUrl: './guide-sidebar.html',
  styleUrl: './guide-sidebar.scss',
  standalone: true
})
export class GuideSidebar {

  constructor(private favoritesService: FavoriteService,
    private guideService: GuideService,
    private dialog: MatDialog,
    private regions: Regions,
    private router: Router,
    private ratingService: RatingService,
    private auth: Auth) { }

  @Input() guide: Guides | null = null;

  @Output() closed = new EventEmitter<void>();

  @Output() guideUpdated = new EventEmitter<Guides>();

  showEdit: boolean = false;

  userRating: number = 0;
  userComment: string = '';
  ratingError: string = '';

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

  toggleFavorite(guide: Guides) {
    if (this.isFavorite(guide)) {
      const item: FavoriteItem = { type: 'guides', data: guide };
      this.favoritesService.removeFavorite(item);
    } else {
      const item: FavoriteItem = { type: 'guides', data: guide };
      this.favoritesService.addFavorite(item);
    }
  }

  isFavorite(guide: Guides): boolean {
    return this.favoritesService.getFavorites().some(
      fav => fav.type === 'guides' && fav.data.id === guide.id
    );
  }

  onUpdated(updatedGuide: Guides) {
    this.guide = updatedGuide;
    this.guideUpdated.emit(updatedGuide);
    this.showEdit = false;
  }

  deleteGuide() {
    if (this.guide) {
      const dialogRef = this.dialog.open(DialogDelete, {
        data: { itemName: this.guide.name }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.guideService.DeleteGuide(this.guide!.id).subscribe(deletedGuide => {
            if (deletedGuide) {
              this.closed.emit();
            }
          });
        }
      });
    }
  }

  getRegionNames(regionIds: number[]): string {
    return regionIds.map(id => this.regions.getAreasById(id)).join(', ');
  }

  getRegionName(regionId: number): string {
    return this.regions.getAreasById(regionId);
  }

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  getAverageRating(): number {
    if (!this.guide) return 0;
    return this.ratingService.getAverageRating('guide', this.guide.id);
  }

  goToRatings() {
    this.ratingService.pendingRatingGuideId = this.guide!.id;
    this.router.navigate(['/ratings', 'guide', this.guide!.id], {
      queryParams: { name: this.guide!.name }
    });
  }

  setUserRating(star: number) {
    this.userRating = star;
  }

  alreadyRated(): boolean {
    if (!this.guide) return false;
    return this.ratingService.hasRated('guide', this.guide.id, this.auth.getCurrentUserName());
  }

  submitRating() {
    this.ratingError = '';
    const userName = this.auth.getCurrentUserName();

    if (this.ratingService.hasRated('guide', this.guide!.id, userName)) {
      this.ratingError = 'כבר דירגת מדריכה זו';
      return;
    }
    if (this.userRating === 0) { this.ratingError = 'יש לבחור דירוג'; return; }
    if (!this.userComment.trim()) { this.ratingError = 'יש להוסיף הערה'; return; }

    this.ratingService.addRating({
      entityType: 'guide',
      entityId: this.guide!.id,
      stars: this.userRating,
      comment: this.userComment.trim(),
      raterName: userName,
      date: new Date()
    });
    this.userRating = 0;
    this.userComment = '';
  }
}


