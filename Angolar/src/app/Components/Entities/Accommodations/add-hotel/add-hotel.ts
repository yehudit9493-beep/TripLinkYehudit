import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { HotelService } from '../../../../Service/hotel-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccommodationWithoutId } from '../../../../Interfacess/accommodation';
import { CommonModule } from '@angular/common';
import { Regions } from '../../../../Service/regions';
import { getCity } from '../../../../Service/city';
import { ApiUrl } from '../../../../Service/api-url';

@Component({
  selector: 'app-add-hotel',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-hotel.html',
  styleUrl: './add-hotel.scss',
  standalone: true
})
export class AddHotel {

  constructor(private hotelService: HotelService,
    private regions: Regions, private cityService: getCity,
    private cdr: ChangeDetectorRef, private apiUrl: ApiUrl
  ) { this.areaList = this.regions.getAllAreas(); }

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<AccommodationWithoutId>();

  areaList: { id: number, name: string }[] = [];
  cities: string[] = [];
  newImageFiles: File[] = [];
  previewUrls: string[] = [];
  isSaving: boolean = false;

  getImageUrl(image: string): string {
    return this.apiUrl.getImageUrl(image);
  }


  addAccommodationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    regionId: new FormControl(0, Validators.required),
    address: new FormControl(''),
    description: new FormControl(''),
    numberOfRooms: new FormControl(0, [Validators.required, Validators.min(1)]),
    numberOfBeds: new FormControl(0, [Validators.required, Validators.min(1)]),
    pricePerNight: new FormControl(0, [Validators.required, Validators.min(1)]),
    phoneNumber: new FormControl(''),
  });

  onSubmit() {
    if (this.addAccommodationForm.valid) {
      if (this.newImageFiles.length > 0) {
        this.uploadNewImages();
      } else {
        this.saveHotel([]);
      }
    } else {
      console.warn('הטופס אינו תקין; אנא בדוק את השדות');
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
        this.saveHotel(response?.imagePaths ?? []);
      },
      error: (error) => {
        console.error('שגיאה בהעלאת תמונות:', error);
        this.isSaving = false;
      }
    });
  }

  saveHotel(images: string[]): void {
    this.isSaving = true;
    const data = {
      ...this.addAccommodationForm.value as AccommodationWithoutId,
      images
    };

    this.hotelService.addHotel(data).subscribe({
      next: (response) => {
        console.log('מקום לינה נוסף בהצלחה');
        this.addAccommodationForm.reset();
        this.newImageFiles = [];
        this.previewUrls = [];
        this.isSaving = false;
        this.updated.emit(response);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בהוספת מקום הלינה:', error);
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
  }

  removeNewImage(index: number): void {
    this.newImageFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.cityService.getCities().subscribe(data => {
      if (data.success && data.result && Array.isArray(data.result.records)) {
        this.cities = data.result.records.map(record => record.שם_ישוב.trim()).sort();
      } else {
        console.error('No cities found or response is not in expected format:', data);
      }
      console.log(this.cities)
    });
  }

}
