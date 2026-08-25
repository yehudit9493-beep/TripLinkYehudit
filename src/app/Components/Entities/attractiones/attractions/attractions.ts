import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Attraction } from '../../../../Interfacess/attraction';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AttractionService } from '../../../../Service/attraction-service';
import { AttractishonSidebar } from '../attractishon-sidebar/attractishon-sidebar';
import { FavoriteService } from '../../../../Service/favorite-service';
import { Subscription } from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Regions } from '../../../../Service/regions';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelect, MatSelectTrigger, MatOption } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { AddAttraction } from "../add-attraction/add-attraction";
import { RatingService } from '../../../../Service/rating-service';

@Component({
  selector: 'app-attractions',
  imports: [MatTableModule, AttractishonSidebar, MatSortModule, MatSelect, MatSelectTrigger, MatOption,
    FormsModule, ReactiveFormsModule, CommonModule, AddAttraction],
  templateUrl: './attractions.html',
  styleUrl: './attractions.scss',
  standalone: true
})

export class Attractions implements OnInit, OnDestroy {

  private _liveAnnouncer = inject(LiveAnnouncer);

  private allAttractions: Attraction[] = [];

  dataSource = new MatTableDataSource<Attraction>([]);

  isAddAttractionOpen = false;

  @ViewChild(MatSort) sort!: MatSort;

  selectedAttraction: Attraction | null = null;
  private attractionSub!: Subscription;

  private areasSub!: Subscription;

  searchText = '';

  constructor(private attractionsService: AttractionService,
    private favoritesService: FavoriteService,
    private regions: Regions,
    private ratingService: RatingService) { this.loadAreaList(); }

  selectedAreas = new FormControl<string[]>([]);

  areaList?: string[]

  loadAreaList() {
    const allAreas = this.regions.getAllAreas();
    this.areaList = allAreas.map(area => area.name);
  }

  ngOnDestroy(): void {
    this.attractionSub?.unsubscribe();
    this.areasSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.attractionsService.GetAttraction().subscribe({
      next: (data) => {
        this.allAttractions = data;
        this.applyFilters();
        this.dataSource.sort = this.sort;


        if (this.favoritesService.pendingAttraction) {
          this.selectedAttraction = this.favoritesService.pendingAttraction;
          this.favoritesService.pendingAttraction = null;
        }

        if (this.ratingService.pendingRatingAttractionId) {
          const attraction = this.allAttractions.find(
            a => a.attractionId === this.ratingService.pendingRatingAttractionId
          );
          if (attraction) this.selectedAttraction = attraction;
          this.ratingService.pendingRatingAttractionId = null;
        }
      }
    });


    this.attractionSub = this.favoritesService.openAttraction$.subscribe((attraction: Attraction) => {
      this.selectedAttraction = attraction;
    });

    this.areasSub = this.selectedAreas.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: Attraction, property: string) => {
      switch (property) {
        case 'region': return this.getRegionName(item.areaId);
        case 'rating': return this.ratingService.getAverageRating('attraction', item.attractionId);
        default: return (item as any)[property];
      }
    };

  }

  displayedColumns: string[] = ['name', 'region', 'typeName', 'entryFee', 'rating', 'actions'];

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  handleShowMore(attraction: Attraction) {
    this.selectedAttraction = attraction;
  }

  closeSidebar() {
    this.selectedAttraction = null;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getRegionName(areaId: number): string {
    return this.regions.getAllAreas().find(area => area.id === areaId)?.name || 'כללי';
  }

  onAddAttraftion() {
    this.isAddAttractionOpen = true;
  }

  onAttraftionAdded() {
    this.isAddAttractionOpen = false;
    this.attractionsService.getAttractions().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      }
    });
  }

  applyFilters() {
    const selectedValues = this.selectedAreas.value || [];
    const search = this.searchText.trim().toLowerCase();

    this.dataSource.data = this.allAttractions.filter(attraction => {
      const regionName = this.getRegionName(attraction.areaId).toLowerCase();
      const matchesArea = selectedValues.length === 0 ||
        selectedValues.includes(this.getRegionName(attraction.areaId));
      const matchesSearch = !search ||
        attraction.attractionName.toLowerCase().includes(search) ||
        regionName.includes(search);

      return matchesArea && matchesSearch;
    });
  }

  getAverageRating(id: number): number {
    return this.ratingService.getAverageRating('attraction', id);
  }

  getStarsArray(rating: number): string[] {
    return this.ratingService.getStarsArray(rating);
  }

}
