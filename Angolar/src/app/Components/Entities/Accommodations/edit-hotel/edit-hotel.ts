import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, signal, computed, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Accommodation } from '../../../../Interfacess/accommodation';
import { HotelService } from '../../../../Service/hotel-service';
import { Regions } from '../../../../Service/regions';
import { getCity } from '../../../../Service/city';
import { ApiUrl } from '../../../../Service/api-url';

@Component({
  selector: 'app-edit-hotel',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-hotel.html',
  styleUrl: './edit-hotel.scss',
  standalone: true
})
export class EditHotel implements OnChanges {
  @Input() hotel!: Accommodation;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Accommodation>();

  areaList: { id: number, name: string }[] = [];
  private cityService = inject(getCity);
  cities = signal<string[]>([]);
  citySearchText = signal<string>('');

  filteredCities = computed(() => {
    const search = this.citySearchText().trim();
    if (!search) return this.cities();
    return this.cities().filter(city => city.includes(search));
  });

  editAccommodationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    regionId: new FormControl(0, Validators.required),
    address: new FormControl(''),
    description: new FormControl(''),
    city: new FormControl('', Validators.required),
    numberOfRooms: new FormControl(0, Validators.required),
    numberOfBeds: new FormControl(0, Validators.required),
    pricePerNight: new FormControl(0, Validators.required),
    phoneNumber: new FormControl(''),
    Auditorium: new FormControl(false),
    Kashrut: new FormControl(''),
  });

  existingImages: string[] = [];
  newImageFiles: File[] = [];
  previewUrls: string[] = [];
  isSaving: boolean = false;

  constructor(private hotelService: HotelService,
    private regions: Regions,
    private cdr: ChangeDetectorRef,
    private apiUrl: ApiUrl
  ) { this.areaList = this.regions.getAllAreas(); }

  getImageUrl(image: string): string {
    return this.apiUrl.getImageUrl(image);
  }


  ngOnInit() {
    this.cityService.getCities().subscribe(data => {
      if (data.success && data.result && Array.isArray(data.result.records)) {
        this.cities.set(data.result.records.map(record => record.שם_ישוב.trim()).sort());
      } else {
        console.error('No cities found or response is not in expected format:', data);
      }
    });
  }

  onCitySearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.citySearchText.set(value);
  }

  selectCity(city: string): void {
    this.editAccommodationForm.patchValue({ city });
    this.citySearchText.set('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hotel'] && this.hotel) {
      this.existingImages = this.hotel.images ? [...this.hotel.images] : [];
      this.newImageFiles = [];
      this.previewUrls = [];
      this.editAccommodationForm.patchValue({
        name: this.hotel.name,
        regionId: this.hotel.regionId,
        address: this.hotel.address,
        description: this.hotel.description,
        numberOfRooms: this.hotel.numberOfRooms,
        numberOfBeds: this.hotel.numberOfBeds,
        pricePerNight: this.hotel.pricePerNight,
        phoneNumber: this.hotel.phoneNumber,
        Auditorium: this.hotel.Auditorium ?? false,
        Kashrut: this.hotel.Kashrut ?? '',
        city: this.hotel.city || ''
      });
    }
  }

  onSubmit(): void {
    if (this.editAccommodationForm.valid) {
      if (this.newImageFiles.length > 0) {
        this.uploadNewImages();
      } else {
        this.saveHotel(this.existingImages);
      }
    }
  }

  uploadNewImages(): void {
    this.isSaving = true;
    const formData = new FormData();
    this.newImageFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.hotelService.uploadImages(formData).subscribe({
      next: (response: any) => {
        const uploaded = response?.imagePaths ?? [];
        this.saveHotel([...this.existingImages, ...uploaded]);
      },
      error: (error) => {
        console.error('שגיאה בהעלאת תמונות:', error);
        this.isSaving = false;
      }
    });
  }

  saveHotel(images: string[]): void {
    this.isSaving = true;
    const updatedHotel: Accommodation = {
      id: this.hotel.id,
      ...this.editAccommodationForm.value as unknown as Omit<Accommodation, 'id'>,
      images
    };
    this.hotelService.UpdateHotel(updatedHotel).subscribe({
      next: (data) => {
        this.isSaving = false;
        this.updated.emit(data);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בעדכון מקום הלינה:', error);
        this.isSaving = false;
      }
    });
  }

  onImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.newImageFiles = Array.from(files);
      this.previewUrls = [];
      this.newImageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      });
    }
    event.target.value = '';
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newImageFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.cdr.detectChanges();
  }

}
