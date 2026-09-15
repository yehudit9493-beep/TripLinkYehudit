// import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
// import { Attraction } from '../../../../Interfacess/attraction';
// import { CommonModule } from '@angular/common';
// import { FavoriteItem, FavoriteService } from '../../../../Service/favorite-service';
// import { EditAttractions } from '../edit-attractions/edit-attractions';
// import { AttractionService } from '../../../../Service/attraction-service';
// import { MatDialog } from '@angular/material/dialog';
// import { DialogDelete } from '../../dialog-delete/dialog-delete';
// import { Regions } from '../../../../Service/regions';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { RatingService } from '../../../../Service/rating-service';
// import { Auth } from '../../../../Service/auth';
// import { getCity } from '../../../../Service/city';

// @Component({
//   selector: 'app-attractishon-sidebar',
//   imports: [CommonModule, EditAttractions, FormsModule],
//   templateUrl: './attractishon-sidebar.html',
//   styleUrl: './attractishon-sidebar.scss',
//   standalone: true
// })
// export class AttractishonSidebar {
//   @Input() attraction: Attraction | null = null;
//   @Output() closed = new EventEmitter<void>();
//   @Output() attractionUpdated = new EventEmitter<Attraction>();

//   private cityService = inject(getCity);
//   cities: any[] = [];

//   currentImageIndex: number = 0;

//   userRating: number = 0;
//   userComment: string = '';
//   ratingError: string = '';

//   // נתוני הדירוג של האטרקציה הנוכחית (נטענים מהשרת ב-ngOnInit)
//   avgRating: number = 0;
//   rated: boolean = false;

//   constructor(private favoritesService: FavoriteService,
//     private attractionService: AttractionService,
//     private dialog: MatDialog,
//     private regions: Regions,
//     private router: Router,
//     private ratingService: RatingService,
//     private auth: Auth
//   ) { }

//   showEdit: boolean = false;

//   ngOnInit() {
//     this.currentImageIndex = 0;

//     this.cityService.getCities().subscribe(data => {
//       if (data.success && data.result && Array.isArray(data.result.records)) {
//         this.cities = data.result.records.map(record => record.שם_ישוב.trim()).sort();
//       } else {
//         console.error('No cities found or response is not in expected format:', data);
//       }
//       console.log(this.cities)
//     });

//     this.loadRating();
//   }

//   // טעינת ממוצע הדירוגים ובדיקה אם המשתמש כבר דירג - עבור האטרקציה הנוכחית
//   loadRating() {
//     if (!this.attraction) return;
//     this.ratingService.loadAverage('attraction', this.attraction.attractionId).subscribe({
//       next: avg => this.avgRating = avg
//     });
//     this.ratingService.hasRated('attraction', this.attraction.attractionId, this.auth.getCurrentUserId()).subscribe({
//       next: rated => this.rated = rated
//     });
//   }

//   close() {
//     this.closed.emit();
//   }

//   nextImage() {
//     if (this.attraction?.images && this.attraction.images.length > 0) {
//       this.currentImageIndex = (this.currentImageIndex + 1) % this.attraction.images.length;
//     }
//   }

//   prevImage() {
//     if (this.attraction?.images && this.attraction.images.length > 0) {
//       this.currentImageIndex = (this.currentImageIndex - 1 + this.attraction.images.length) % this.attraction.images.length;
//     }
//   }

//   goToImage(index: number) {
//     this.currentImageIndex = index;
//   }

//   getStarsArray(rating: number, maxStars: number = 5): string[] {
//     const rounded = Math.round(rating);
//     const result: string[] = [];
//     for (let i = 1; i <= maxStars; i++) {
//       result.push(i <= rounded ? 'full' : 'empty');
//     }
//     return result;
//   }

//   toggleFavorite(attraction: Attraction) {
//     if (this.isFavorite(attraction)) {
//       const item: FavoriteItem = { type: 'attraction', data: attraction };
//       this.favoritesService.removeFavorite(item);
//     } else {
//       const item: FavoriteItem = { type: 'attraction', data: attraction };
//       this.favoritesService.addFavorite(item);
//     }
//   }

//   isFavorite(attraction: Attraction): boolean {
//     return this.favoritesService.getFavorites().some(
//       fav => fav.type === 'attraction' && (fav.data.attractionId ?? fav.data.id) === attraction.attractionId
//     );
//   }

//   onUpdated(updatedAttraction: Attraction) {
//     this.attraction = updatedAttraction;
//     this.attractionUpdated.emit(updatedAttraction);
//     this.showEdit = false;
//   }

//   deleteAttraction() {
//     if (this.attraction) {
//       const dialogRef = this.dialog.open(DialogDelete, {
//         data: { itemName: this.attraction.attractionName }
//       });

//       dialogRef.afterClosed().subscribe(result => {
//         if (result) {
//           this.attractionService.DeleteAttraction(this.attraction!.attractionId).subscribe(deletedAttraction => {
//             if (deletedAttraction?.isSuccess) {
//               this.closed.emit();
//             }
//           });
//         }
//       });
//     }
//   }

//   getRegionName(regionId: number): string {
//     return this.regions.getAreasById(regionId);
//   }

//   // קריאת ממוצע הדירוגים (מהמשתנה שנטען מהשרת)
//   getAverageRating(): number {
//     return this.avgRating;
//   }

//   goToRatings() {
//     this.ratingService.pendingRatingAttractionId = this.attraction!.attractionId;
//     this.router.navigate(['/ratings', 'attraction', this.attraction!.attractionId], {
//       queryParams: { name: this.attraction!.attractionName }
//     });
//   }

//   setUserRating(star: number) {
//     this.userRating = star;
//   }

//   alreadyRated(): boolean {
//     return this.rated;
//   }

//   submitRating() {
//     this.ratingError = '';

//     if (this.rated) {
//       this.ratingError = 'כבר דירגת אטרקציה זו';
//       return;
//     }
//     if (this.userRating === 0) { this.ratingError = 'יש לבחור דירוג'; return; }
//     if (!this.userComment.trim()) { this.ratingError = 'יש להוסיף הערה'; return; }

//     this.ratingService.addRating({
//       entityType: 'attraction',
//       entityId: this.attraction!.attractionId,
//       stars: this.userRating,
//       comment: this.userComment.trim(),
//       raterName: this.auth.getCurrentUserName(),
//       date: new Date()
//     }, this.auth.getCurrentUserId()).subscribe({
//       next: () => {
//         this.rated = true;
//         this.ratingError = '';
//         // רענון הממוצע לאחר ההוספה
//         this.ratingService.loadAverage('attraction', this.attraction!.attractionId).subscribe({
//           next: avg => this.avgRating = avg
//         });
//       },
//       error: (err) => {
//         // טיפול בשגיאה (למשל כבר דירגו - דרך אינדקס ייחודי בשרת)
//         const msg = err?.error?.message;
//         if (msg) {
//           this.ratingError = msg;
//         } else {
//           this.ratingError = 'שגיאה בשמירת הדירוג';
//         }
//       }
//     });
//     this.userRating = 0;
//     this.userComment = '';
//   }

// }



import { Component, EventEmitter, inject, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-attractishon-sidebar',
  imports: [CommonModule, EditAttractions, FormsModule],
  templateUrl: './attractishon-sidebar.html',
  styleUrl: './attractishon-sidebar.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttractishonSidebar implements OnInit, OnChanges, OnDestroy {
  @Input() attraction: Attraction | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() attractionUpdated = new EventEmitter<Attraction>();

  private cityService = inject(getCity);
  cities: any[] = [];

  currentImageIndex: number = 0;

  userRating: number = 0;
  userComment: string = '';
  ratingError: string = '';

  // נתוני הדירוג של האטרקציה הנוכחית
  avgRating: number = 0;
  rated: boolean = false;

  showEdit: boolean = false;

  private destroy$ = new Subject<void>();
  private citiesLoaded = false; // דגל לטעינת ערים רק פעם אחת

  constructor(
    private favoritesService: FavoriteService,
    private attractionService: AttractionService,
    private dialog: MatDialog,
    private regions: Regions,
    private router: Router,
    private ratingService: RatingService,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.currentImageIndex = 0;

    // טען ערים רק פעם אחת (לא בכל שינוי של attraction)
    if (!this.citiesLoaded) {
      this.cityService.getCities()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            if (data.success && data.result && Array.isArray(data.result.records)) {
              this.cities = data.result.records
                .map(record => record.שם_ישוב.trim())
                .sort();
            } else {
              console.error('No cities found or response is not in expected format:', data);
            }
          },
          error: (err) => console.error('Error loading cities:', err)
        });
      this.citiesLoaded = true;
    }
  }

  // ✅ זה הפתרון הראשי - קרא ל-loadRating() כשה-attraction משתנה
  ngOnChanges(changes: SimpleChanges) {
    if (changes['attraction'] && this.attraction) {
      this.currentImageIndex = 0;
      this.userRating = 0;
      this.userComment = '';
      this.ratingError = '';
      this.loadRating();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ טעינת ממוצע הדירוגים ובדיקה אם המשתמש כבר דירג
  loadRating() {
    if (!this.attraction) {
      console.warn('loadRating() called but attraction is null');
      return;
    }

    const entityType = 'attraction';
    const entityId = this.attraction.attractionId;
    const userId = this.auth.getCurrentUserId();

    // טעינת הממוצע
    this.ratingService.loadAverage(entityType, entityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (avg) => {
          this.avgRating = avg;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error loading average rating:', err)
      });

    // בדיקה אם המשתמש כבר דירג
    this.ratingService.hasRated(entityType, entityId, userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rated) => {
          this.rated = rated;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error checking if rated:', err)
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
          this.attractionService.DeleteAttraction(this.attraction!.attractionId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (deletedAttraction) => {
                if (deletedAttraction?.isSuccess) {
                  this.closed.emit();
                }
              },
              error: (err) => console.error('Error deleting attraction:', err)
            });
        }
      });
    }
  }

  getRegionName(regionId: number): string {
    return this.regions.getAreasById(regionId);
  }

  // ✅ קריאת ממוצע הדירוגים (מהמשתנה שנטען מהשרת)
  getAverageRating(): number {
    return this.avgRating;
  }

  goToRatings() {
    if (this.attraction) {
      this.ratingService.pendingRatingAttractionId = this.attraction.attractionId;
      this.router.navigate(['/ratings', 'attraction', this.attraction.attractionId], {
        queryParams: { name: this.attraction.attractionName }
      });
    }
  }

  setUserRating(star: number) {
    this.userRating = star;
  }

  alreadyRated(): boolean {
    return this.rated;
  }

  submitRating() {
    this.ratingError = '';

    if (this.rated) {
      this.ratingError = 'כבר דירגת אטרקציה זו';
      return;
    }
    if (this.userRating === 0) {
      this.ratingError = 'יש לבחור דירוג';
      return;
    }
    if (!this.userComment.trim()) {
      this.ratingError = 'יש להוסיף הערה';
      return;
    }

    if (!this.attraction) {
      this.ratingError = 'שגיאה: לא נמצאה אטרקציה';
      return;
    }

    const rating = {
      entityType: 'attraction' as const,
      entityId: this.attraction.attractionId,
      stars: this.userRating,
      comment: this.userComment.trim(),
      raterName: this.auth.getCurrentUserName(),
      date: new Date()
    };

    this.ratingService.addRating(rating, this.auth.getCurrentUserId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.rated = true;
          this.ratingError = '';
          this.userRating = 0;
          this.userComment = '';
          this.cdr.markForCheck();

          // רענון הממוצע לאחר ההוספה
          this.ratingService.loadAverage('attraction', this.attraction!.attractionId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (avg) => {
                this.avgRating = avg;
                this.cdr.markForCheck();
              }
            });
        },
        error: (err) => {
          const msg = err?.error?.message;
          this.ratingError = msg || 'שגיאה בשמירת הדירוג';
          console.error('Error submitting rating:', err);
        }
      });
  }
}