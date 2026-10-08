import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe, AsyncPipe } from '@angular/common';
import { Rating, RatingService } from '../../Service/rating-service';
import { Location } from '@angular/common';
import { HebrewDateConverterPipe } from '../../pipe/hebrewDateConverter.pipe';

@Component({
  selector: 'app-ratings-list',
  standalone: true,
  imports: [CommonModule, DatePipe, HebrewDateConverterPipe, AsyncPipe],
  templateUrl: './ratings-list.html',
  styleUrl: './ratings-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingsList implements OnInit {

  ratings: Rating[] = [];
  entityId: number = 0;
  entityType: string = '';
  entityName: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ratingService: RatingService,
    private location: Location,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.entityType = this.route.snapshot.paramMap.get('type') ?? '';
    this.entityId = Number(this.route.snapshot.paramMap.get('id'));
    this.entityName = this.route.snapshot.queryParamMap.get('name') ?? '';

    // טעינת כל הדירוגים של הישות מהשרת (לפי הסוג והמזהה שבנתיב)
    this.ratingService.getRatings(this.entityType, this.entityId).subscribe({
      next: ratings => {
        this.ratings = ratings;
        this.loading = false;
        this.cdr.markForCheck(); 
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();  
      },
      complete: () => {
        this.loading = false;
        this.cdr.markForCheck(); 
      }
    });
  }

  getStarsArray(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 'full' : 'empty');
  }

  goBack() {
  this.location.back();
}
}