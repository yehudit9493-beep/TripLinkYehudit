import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Guides } from '../../../../Interfacess/guides';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GuideService } from '../../../../Service/guide-service';
import { GuideSidebar } from "../guide-sidebar/guide-sidebar";
import { Subscription } from 'rxjs';
import { FavoriteService } from '../../../../Service/favorite-service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddGuide } from '../add-guide/add-guide';
import { Regions } from '../../../../Service/regions';
import { RatingService } from '../../../../Service/rating-service';


@Component({
  selector: 'app-guide',
  imports: [MatTableModule, GuideSidebar, MatSortModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, AddGuide],
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
  standalone: true
})
export class Guide implements OnInit, OnDestroy {

  private _liveAnnouncer = inject(LiveAnnouncer);

  private allGuides: Guides[] = [];

  dataSource = new MatTableDataSource<Guides>([]);

  selectedGuide: Guides | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  private guideSub!: Subscription;
  private areasSub!: Subscription;

  constructor(private guideService: GuideService,
    private favoritesService: FavoriteService,
    private ratingService: RatingService,
    private regions: Regions) { this.loadAreaList(); }

  isAddGuideOpen = false;

  searchText = '';

  selectedAreas = new FormControl<string[]>([]);

  areaList?: string[]

  loadAreaList() {
    const allAreas = this.regions.getAllAreas();
    this.areaList = allAreas.map(area => area.name);
  }

  ngOnInit(): void {
    this.guideService.GetGuide().subscribe({
      next: (data) => {
        this.allGuides = data;
        this.applyFilters();
        this.dataSource.sort = this.sort;

        if (this.favoritesService.pendingGuide) {
          this.selectedGuide = this.favoritesService.pendingGuide;
          this.favoritesService.pendingGuide = null;
        }

        if (this.ratingService.pendingRatingGuideId) {
          const guide = this.allGuides.find(g => g.id === this.ratingService.pendingRatingGuideId);
          if (guide) this.selectedGuide = guide;
          this.ratingService.pendingRatingGuideId = null;
        }

      }
    });

    this.guideSub = this.favoritesService.openGuide$!.subscribe((guide: Guides) => {
      this.selectedGuide = guide;
    });

    this.areasSub = this.selectedAreas.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.guideSub?.unsubscribe();
    this.areasSub?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: Guides, property: string) => {
      switch (property) {
        case 'trainingRegions': return item.trainingRegionsId?.toString() || '';
        case 'yearsOfExperience': return item.yearsOfExperience;
        case 'rating': return this.getAverageRating(item.id);
        default: return (item as any)[property];
      }
    };
  }

  displayedColumns: string[] = [
    'name', 'trainingRegions', 'yearsOfExperience', 'rating', 'actions'];


  applyFilters() {
    const selectedValues = this.selectedAreas.value || [];
    const search = this.searchText.trim().toLowerCase();


    const selectedIds = selectedValues.map(name =>
      this.regions.getAllAreas().find(area => area.name === name)?.id
    ).filter(id => id !== undefined) as number[];

    this.dataSource.data = this.allGuides.filter(guide => {
      const matchesArea = selectedIds.length === 0 ||
        selectedIds.some(id => guide.trainingRegionsId?.includes(id));

      const matchesSearch = !search ||
        guide.name?.toLowerCase().includes(search) ||
        guide.trainingRegionsId?.some(id =>
          this.regions.getAreasById(id).toLowerCase().includes(search)
        );

      return matchesArea && matchesSearch;
    });
  }


  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  handleShowMore(guide: Guides) {
    this.selectedGuide = guide;
  }

  closeSidebar() {
    this.selectedGuide = null;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getRegionName(areaId: number): string {
    return this.regions.getAreasById(areaId);
  }

  onAddGuide() {
    this.isAddGuideOpen = true;
  }

  onGuideAdded() {
    this.isAddGuideOpen = false;
    this.guideService.getGuids().subscribe({
      next: (data) => {
        this.allGuides = data;
        this.applyFilters();
      }
    });
  }

  getRegionNames(regionIds: number[]): string {
    return regionIds.map(id => this.regions.getAreasById(id)).join(', ');
  }

  getAverageRating(id: number): number {
    return this.ratingService.getAverageRating('guide', id);
  }

  getStarsArray(rating: number): string[] {
    return this.ratingService.getStarsArray(rating);
  }
}


