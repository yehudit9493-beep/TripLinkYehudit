import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Trail } from '../../../../Interfacess/Trail';
import { TrailSidebar } from '../trail-sidebar/trail-sidebar';
import { TrailsService } from '../../../../Service/TrailsService';
import { Subscription } from 'rxjs';
import { FavoriteService } from '../../../../Service/favorite-service';
import { Regions } from '../../../../Service/regions';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTrail } from '../add-trail/add-trail';
import { RatingService } from '../../../../Service/rating-service';

@Component({
  selector: 'app-routes',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, TrailSidebar, AddTrail,
    MatSortModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './trails.html',
  styleUrl: './trails.scss',
  standalone: true
})

export class Trails implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;

  isAddTrailOpen = false;

  private _liveAnnouncer = inject(LiveAnnouncer);

  private allTrails: Trail[] = [];

  displayedColumns: string[] = ['name', 'region', 'RouteLengthInKM', 'RouteDuration', 'rating', 'actions'];

  dataSource = new MatTableDataSource<Trail>([]);

  constructor(private trailsService: TrailsService,
    private favoritesService: FavoriteService,
    private regions: Regions,
    private router: Router,
    private route: ActivatedRoute,
    private ratingService: RatingService) {
    this.loadAreaList();

  }
  ngOnDestroy(): void {
    this.trailSub?.unsubscribe();
    this.areasSub?.unsubscribe();
  }

  searchText = '';

  selectedAreas = new FormControl<string[]>([]);

  areaList?: string[]

  private areasSub!: Subscription;

  loadAreaList() {
    const allAreas = this.regions.getAllAreas();
    this.areaList = allAreas.map(area => area.name);
  }

  ngOnInit(): void {
    this.trailsService.GetTrail().subscribe({
      next: (data) => {
        this.allTrails = data;
        this.applyFilters();
        this.dataSource.sort = this.sort;

        if (this.favoritesService.pendingTrail) {
          this.selectedTrail = this.favoritesService.pendingTrail;
          this.favoritesService.pendingTrail = null;
        }


        if (this.ratingService.pendingRatingTrailId) {
          const trail = this.allTrails.find(t => t.id === this.ratingService.pendingRatingTrailId);
          if (trail) this.selectedTrail = trail;
          this.ratingService.pendingRatingTrailId = null;
        }
      }
    });

    this.trailSub = this.favoritesService.openTrail$.subscribe((trail: Trail) => {
      this.selectedTrail = trail;
    });

    this.areasSub = this.selectedAreas.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: Trail, property: string) => {
      switch (property) {
        case 'region':
          return this.getRegionName(item.regionId);
        case 'rating': return this.getAverageRating(item.id);
        default:
          return (item as any)[property];
      }
    };
  }

  applyFilters() {
    const selectedValues = this.selectedAreas.value || [];
    const search = this.searchText.trim().toLowerCase();

    this.dataSource.data = this.allTrails.filter(trail => {
      const regionName = this.getRegionName(trail.regionId).toLowerCase();
      const matchesArea = selectedValues.length === 0 ||
        selectedValues.includes(this.getRegionName(trail.regionId));
      const matchesSearch = !search ||
        trail.name.toLowerCase().includes(search) ||
        regionName.includes(search);

      return matchesArea && matchesSearch;
    });
  }


  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  selectedTrail: Trail | null = null;
  private trailSub!: Subscription;

  handleShowMore(trail: Trail) {
    this.selectedTrail = trail;
  }

  closeSidebar() {
    this.selectedTrail = null;
  }


  getRegionName(areaId: number): string {
    const region = this.regions.getAreasById(areaId);
    return region
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onAddTrail() {
    this.isAddTrailOpen = true;
  }

  onTrailAdded() {
    this.isAddTrailOpen = false;
    this.trailsService.GetTrail().subscribe({
      next: (data) => {
        this.allTrails = data;
        this.applyFilters();
      }
    });
  }

  getAverageRating(id: number): number {
    return this.ratingService.getAverageRating('trail', id);
  }

  getStarsArray(rating: number): string[] {
    return this.ratingService.getStarsArray(rating);
  }

}
