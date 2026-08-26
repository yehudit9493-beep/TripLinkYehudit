import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { AttractionWithoutId } from '../../../../Interfacess/attraction';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttractionService } from '../../../../Service/attraction-service';
import { CommonModule } from '@angular/common';
import { Regions } from '../../../../Service/regions';

@Component({
  selector: 'app-add-attraction',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-attraction.html',
  styleUrl: './add-attraction.scss',
  standalone: true
})
export class AddAttraction {

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<AttractionWithoutId>();

  areaList: { id: number, name: string }[] = [];
  newImageFiles: File[] = [];
  previewUrls: string[] = [];
  isSaving: boolean = false;

  constructor(private attractionService: AttractionService,
    private regions: Regions, private cdr: ChangeDetectorRef) { this.areaList = this.regions.getAllAreas(); }

  addAttractionForm = new FormGroup({
    name: new FormControl('', Validators.required),
    regionId: new FormControl(0, Validators.required),
    address: new FormControl(''),
    type: new FormControl(''),
    entryFee: new FormControl(0),
    openingHours: new FormControl(''),
    phoneNumber: new FormControl(''),
    description: new FormControl(''),
    suitableForKids: new FormControl(false),
    SabbathKeeper : new FormControl(true),
  });

  onSubmit() {
    if (this.addAttractionForm.valid) {
      if (this.newImageFiles.length > 0) {
        this.uploadNewImages();
      } else {
        this.saveAttraction();
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

    this.attractionService.uploadImages(formData).subscribe({
      next: (response: any) => {
        const attractionData = {
          ...this.addAttractionForm.value as AttractionWithoutId,
          images: response.imagePaths
        };
        this.saveAttractionWithImages(attractionData);
      },
      error: (error) => {
        console.error('שגיאה בהעלאת תמונות:', error);
        this.isSaving = false;
      }
    });
  }

  saveAttractionWithImages(attractionData: any): void {
    this.attractionService.addAttraction(attractionData).subscribe({
      next: (response) => {
        console.log('אטרקציה נוספה בהצלחה עם תמונות');
        this.addAttractionForm.reset();
        this.newImageFiles = [];
        this.previewUrls = [];
        this.isSaving = false;
        this.updated.emit(response);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בהוספת האטרקציה:', error);
        this.isSaving = false;
      }
    });
  }

  saveAttraction(): void {
    this.isSaving = true;
    this.attractionService.addAttraction(this.addAttractionForm.value as AttractionWithoutId).subscribe({
      next: (response) => {
        console.log('אטרקציה נוספה בהצלחה');
        this.addAttractionForm.reset();
        this.isSaving = false;
        this.updated.emit(response);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בהוספת האטרקציה:', error);
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


}
