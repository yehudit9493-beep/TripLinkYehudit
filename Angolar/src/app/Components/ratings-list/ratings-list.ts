import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Rating, RatingService } from '../../Service/rating-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ratings-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './ratings-list.html',
  styleUrl: './ratings-list.scss'
})
export class RatingsList implements OnInit {

  ratings: Rating[] = [];
  entityId: number = 0;
  entityType: string = '';
  entityName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ratingService: RatingService,
    private location: Location
  ) {}

  ngOnInit() {
    this.entityType = this.route.snapshot.paramMap.get('type') ?? '';
    this.entityId = Number(this.route.snapshot.paramMap.get('id'));
    this.entityName = this.route.snapshot.queryParamMap.get('name') ?? '';

    // טעינת כל הדירוגים של הישות מהשרת (לפי הסוג והמזהה שבנתיב)
    this.ratingService.getRatings(this.entityType, this.entityId).subscribe({
      next: ratings => this.ratings = ratings
    });
  }

  getStarsArray(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 'full' : 'empty');
  }

  goBack() {
  this.location.back();
}
}