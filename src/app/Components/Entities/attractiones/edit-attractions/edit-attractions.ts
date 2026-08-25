import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, computed, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Attraction } from '../../../../Interfacess/attraction';
import { AttractionService } from '../../../../Service/attraction-service';
import { Regions } from '../../../../Service/regions';
import { getCity } from '../../../../Service/city';

@Component({
  selector: 'app-edit-attractions',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-attractions.html',
  styleUrl: './edit-attractions.scss',
  standalone: true
})
export class EditAttractions implements OnChanges, OnInit {

  @Input() attraction!: Attraction;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Attraction>();

  private cityService = inject(getCity);
  cities = signal<string[]>([]);
  citySearchText = signal<string>('');

  filteredCities = computed(() => {
    const search = this.citySearchText().trim();
    if (!search) return this.cities();
    return this.cities().filter(city => city.includes(search));
  });

  areaList: { id: number, name: string }[] = [];
  newImageFiles: File[] = [];
  previewUrls: string[] = [];
  existingImages: string[] = [];
  isSaving: boolean = false;

  editAttractionForm = new FormGroup({
    name: new FormControl('', Validators.required),
    regionId: new FormControl(0, Validators.required),
    address: new FormControl(''),
    type: new FormControl(''),
    entryFee: new FormControl(0),
    openingHours: new FormControl(''),
    phoneNumber: new FormControl(''),
    description: new FormControl(''),
    suitableForKids: new FormControl(false),
    SabbathKeeper: new FormControl(true),
    city: new FormControl(''),
  });

  constructor(private attractionService: AttractionService,
    private regions: Regions, private cdr: ChangeDetectorRef
  ) { this.areaList = this.regions.getAllAreas(); }

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
    this.editAttractionForm.patchValue({ city });
    this.citySearchText.set('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['attraction'] && this.attraction) {
      this.editAttractionForm.patchValue({
        name: this.attraction.attractionName,
        regionId: this.attraction.areaId,
        address: this.attraction.address,
        type: this.attraction.typeName,
        entryFee: this.attraction.entryFee,
        openingHours: this.attraction.openingHours,
        phoneNumber: this.attraction.phoneNumber,
        description: this.attraction.description,
        suitableForKids: this.attraction.suitableForKids,
        SabbathKeeper: this.attraction.sabbathKeeper,
        city: this.attraction.city
      });
      this.existingImages = this.attraction.images || [];
      this.newImageFiles = [];
      this.previewUrls = [];
    }
  }

  onSubmit(): void {
    if (this.editAttractionForm.valid) {
      if (this.newImageFiles.length > 0) {
        this.uploadNewImages();
      } else {
        this.saveAttraction();
      }
    }
  }

  uploadNewImages(): void {
    this.isSaving = true;
    const formData = new FormData();

    this.newImageFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.attractionService.uploadImages(formData).subscribe({
      // next: (response: any) => {
      //   // ז
      //   this.saveAttractionWithImages(updatedAttraction);
      // },
      // error: (error) => {
      //   console.error('שגיאה בהעלאת תמונות:', error);
      //   this.isSaving = false;
      // }
    });
  }

  saveAttractionWithImages(updatedAttraction: Attraction): void {
    this.attractionService.UpdateAttraction(updatedAttraction).subscribe({
      next: (data) => {
        console.log('אטרקציה עודכנה בהצלחה עם תמונות');
        this.newImageFiles = [];
        this.previewUrls = [];
        this.isSaving = false;
        this.updated.emit(data);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בעדכון האטרקציה:', error);
        this.isSaving = false;
      }
    });
  }

  saveAttraction(): void {
    this.isSaving = true;
    const formValue = this.editAttractionForm.value;

    const updatedAttraction: Attraction = {
      attractionId: this.attraction.attractionId,
      attractionName: formValue.name || '',
      areaId: formValue.regionId ?? this.attraction.areaId,
      address: formValue.address || '',
      typeName: formValue.type || '',
      entryFee: formValue.entryFee || 0,
      openingHours: formValue.openingHours || '',
      phoneNumber: formValue.phoneNumber || '',
      description: formValue.description || '',
      suitableForKids: formValue.suitableForKids ?? false,
      sabbathKeeper: formValue.SabbathKeeper ?? false,
      images: this.existingImages,
      city: formValue.city || '',
    };

    this.attractionService.UpdateAttraction(updatedAttraction).subscribe({
      next: (data) => {
        this.isSaving = false;
        this.updated.emit(data);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בעדכון האטרקציה:', error);
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

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
    this.cdr.detectChanges();
  }

  removeNewImage(index: number): void {
    this.newImageFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.cdr.detectChanges();
  }

}
