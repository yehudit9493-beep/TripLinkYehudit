import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Accommodation } from '../../../../Interfacess/accommodation';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HotelService } from '../../../../Service/hotel-service';
import { HotelSidebar } from "../hotel-sidebar/hotel-sidebar";
import { FavoriteService } from '../../../../Service/favorite-service';
import { Subscription } from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Regions } from '../../../../Service/regions';
import { AddHotel } from "../add-hotel/add-hotel";
import { MatSelect, MatSelectTrigger, MatOption } from "@angular/material/select";
import { RatingService } from '../../../../Service/rating-service';

@Component({
  selector: 'app-hotels',
  imports: [MatTableModule, HotelSidebar, MatSortModule, AddHotel, MatSelect, MatSelectTrigger, MatOption, ReactiveFormsModule],
  templateUrl: './hotels.html',
  styleUrl: './hotels.scss',
  standalone: true
})
export class Hotels implements OnInit, OnDestroy {

  private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatSort) sort!: MatSort;

  isAddHotelOpen = false;

  searchText = '';

  selectedAreas = new FormControl<string[]>([]);

  areaList?: string[]

  displayedColumns: string[] = [
    'name', 'region', 'numberOfRooms', 'rating', 'actions'];

  private allHotels: Accommodation[] = [];

  dataSource = new MatTableDataSource<Accommodation>([]);

  selectedHotel: Accommodation | null = null;

  private accommodationSub!: Subscription;

  private areasSub!: Subscription;

  constructor(private hotelService: HotelService,
    private favoritesService: FavoriteService,
    private regions: Regions,
    private ratingService: RatingService) { this.loadAreaList(); }

  loadAreaList() {
    const allAreas = this.regions.getAllAreas();
    this.areaList = allAreas.map(area => area.name);
  }

  ngOnDestroy(): void {
    this.accommodationSub?.unsubscribe();
    this.areasSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.hotelService.GetTrail().subscribe({
      next: (data) => {
        this.allHotels = data;
        this.applyFilters();
        this.dataSource.sort = this.sort;

        if (this.favoritesService.pendingAccommodation) {
          this.selectedHotel = this.favoritesService.pendingAccommodation;
          this.favoritesService.pendingAccommodation = null;
        }

        if (this.ratingService.pendingRatingHotelId) {
          const hotel = this.allHotels.find(h => h.id === this.ratingService.pendingRatingHotelId);
          if (hotel) this.selectedHotel = hotel;
          this.ratingService.pendingRatingHotelId = null;
        }

      }
    });

    this.accommodationSub = this.favoritesService.openAccommodation$.subscribe((hotel: Accommodation) => {
      this.selectedHotel = hotel;
    });

    this.areasSub = this.selectedAreas.valueChanges.subscribe(() => {
      this.applyFilters();
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: Accommodation, property: string) => {
      switch (property) {
        case 'region': return this.getRegionName(item.regionId);
        case 'rating': return this.getAverageRating(item.id);
        default: return (item as any)[property];
      }
    };
  }

  applyFilters() {
    const selectedValues = this.selectedAreas.value || [];
    const search = this.searchText.trim().toLowerCase();

    this.dataSource.data = this.allHotels.filter(hotel => {
      const regionName = this.getRegionName(hotel.regionId).toLowerCase();
      const matchesArea = selectedValues.length === 0 ||
        selectedValues.includes(this.getRegionName(hotel.regionId));
      const matchesSearch = !search ||
        hotel.name.toLowerCase().includes(search) ||
        regionName.includes(search);

      return matchesArea && matchesSearch;
    });
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  handleShowMore(hotel: Accommodation) {
    this.selectedHotel = hotel;
  }

  closeSidebar() {
    this.selectedHotel = null;
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

  onAddHotel() {
    this.isAddHotelOpen = true;
  }

  onHotelAdded() {
    this.isAddHotelOpen = false;
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.allHotels = data;
        this.applyFilters();
      }
    });
  }

  getRegionNames(regionIds: number[]): string {
    return regionIds.map(id => this.regions.getAreasById(id)).join(', ');
  }

  getAverageRating(id: number): number {
    return this.ratingService.getAverageRating('accommodation', id);
  }

  getStarsArray(rating: number): string[] {
    return this.ratingService.getStarsArray(rating);
  }

}
