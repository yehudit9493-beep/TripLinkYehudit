import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrailsService } from '../../../../Service/TrailsService';
import { TrailWithoutId } from '../../../../Interfacess/Trail';
import { CommonModule } from '@angular/common';
import { Regions } from '../../../../Service/regions';

@Component({
  selector: 'app-add-trail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trail.html',
  styleUrl: './add-trail.scss',
  standalone: true
})
export class AddTrail {

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<TrailWithoutId>();

  newImageFiles: File[] = [];
  previewUrls: string[] = [];
  isSaving: boolean = false;

  areaList: { id: number, name: string }[] = [];

  constructor(private trailService: TrailsService,
    private regions: Regions, private cdr: ChangeDetectorRef
  ) { this.areaList = this.regions.getAllAreas(); }

  addTrailForm = new FormGroup({
    name: new FormControl('', Validators.required),
    describshain: new FormControl(''),
    regionId: new FormControl(0, Validators.required),
    directions: new FormControl(''),
    RouteLengthInKM: new FormControl(0, Validators.required),
    RouteDuration: new FormControl('', Validators.required),
    DifficultyLevel: new FormControl('', Validators.required),
    minimumAge: new FormControl(0, Validators.required),
    MaximumAge: new FormControl(0, Validators.required),
    WetDryTrack: new FormControl('', Validators.required),
    season: new FormControl<string[]>([], Validators.required),
  });

  //   onSubmit() {
  //       if (this.addTrailForm.valid) {
  //       if (this.newImageFiles.length > 0) {
  //         this.uploadNewImages();
  //       } else {
  //         this.saveTrail();
  //       }
  //     } else {
  //       console.warn('הטופס אינו תקין; אנא בדוק את השדות');
  //     }

  //   }

  //   onSeasonChange(event: Event) {
  //     const checkbox = event.target as HTMLInputElement;
  //     const currentSeasons: string[] = this.addTrailForm.get('season')?.value || [];

  //     if (checkbox.value === 'כל השנה' && checkbox.checked) {
  //       // בחרו כל השנה — מנקים הכל ושמים רק כל השנה
  //       this.addTrailForm.get('season')?.setValue(['כל השנה']);
  //     } else if (checkbox.checked) {
  //       // בחרו עונה ספציפית — מסירים כל השנה אם היה
  //       const newSeasons = [...currentSeasons.filter(s => s !== 'כל השנה'), checkbox.value];
  //       this.addTrailForm.get('season')?.setValue(newSeasons);
  //     } else {
  //       // ביטלו עונה
  //       this.addTrailForm.get('season')?.setValue(
  //         currentSeasons.filter(s => s !== checkbox.value)
  //       );
  //     }
  //   }

  // uploadNewImages(): void {
  //     this.isSaving = true;
  //     const formData = new FormData();

  //     this.newImageFiles.forEach((file) => {
  //       formData.append('images', file);
  //     });

  //     this.trailService.uploadImages(formData).subscribe({
  //       next: (response: any) => {
  //         const trailData = {
  //           ...this.addTrailForm.value as TrailWithoutId,
  //           images: response.imagePaths
  //         };
  //         this.saveTrailWithImages(trailData);
  //       },
  //       error: (error) => {
  //         console.error('שגיאה בהעלאת תמונות:', error);
  //         this.isSaving = false;
  //       }
  //     });
  //   }

  //    saveTrailWithImages(trailData: any): void {
  //     this.trailService.addTrail(trailData).subscribe({
  //       next: (response) => {
  //         console.log('מסלול נוסף בהצלחה עם תמונות');
  //         this.addTrailForm.reset();
  //         this.newImageFiles = [];
  //         this.previewUrls = [];
  //         this.isSaving = false;
  //         this.updated.emit(response.data);
  //         this.closed.emit();
  //       },
  //       error: (error) => {
  //         console.error('שגיאה בהוספת המסלול:', error);
  //         this.isSaving = false;
  //       }
  //     });
  //   }

  //    saveTrail(): void {
  //     this.isSaving = true;
  //     this.trailService.addTrail(this.addTrailForm.value as TrailWithoutId).subscribe({
  //       next: (response) => {
  //         console.log('מסלול נוסף בהצלחה');
  //         this.addTrailForm.reset();
  //         this.isSaving = false;
  //         this.updated.emit(response.message'');
  //         this.closed.emit();
  //       },
  //       error: (error) => {
  //         console.error('שגיאה בהוספת המסלול:', error);
  //         this.isSaving = false;
  //       }
  //     });
  //   }

  //    onImagesSelected(event: any): void {
  //     const files: FileList = event.target.files;

  //     if (files && files.length > 0) {
  //       this.newImageFiles = Array.from(files);

  //       this.previewUrls = [];
  //       this.newImageFiles.forEach((file) => {
  //         const reader = new FileReader();
  //         reader.onload = (e: any) => {
  //           this.previewUrls.push(e.target.result);
  //           this.cdr.detectChanges();
  //         };
  //         reader.readAsDataURL(file);
  //       });
  //     }
  //   }

  //   removeNewImage(index: number): void {
  //     this.newImageFiles.splice(index, 1);
  //     this.previewUrls.splice(index, 1);
  //     this.cdr.detectChanges();
  //   }

  onSubmit() {
    if (this.addTrailForm.valid) {
      this.trailService.addTrail(this.addTrailForm.value as TrailWithoutId).subscribe({
        next: (response) => {
          console.log('מסלול נוסף בהצלחה:');
          this.addTrailForm.reset();
          this.updated.emit(this.addTrailForm.value as TrailWithoutId);
          this.closed.emit();
        },
        error: (error) => {
          console.error('שגיאה בהוספת המסלול:', error);
        }
      });
    } else {
      console.warn('הטופס אינו תקין; אנא בדוק את השדות');
    }
  }

  onSeasonChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const currentSeasons: string[] = this.addTrailForm.get('season')?.value || [];

    if (checkbox.value === 'כל השנה' && checkbox.checked) {
      // בחרו כל השנה — מנקים הכל ושמים רק כל השנה
      this.addTrailForm.get('season')?.setValue(['כל השנה']);
    } else if (checkbox.checked) {
      // בחרו עונה ספציפית — מסירים כל השנה אם היה
      const newSeasons = [...currentSeasons.filter(s => s !== 'כל השנה'), checkbox.value];
      this.addTrailForm.get('season')?.setValue(newSeasons);
    } else {
      // ביטלו עונה
      this.addTrailForm.get('season')?.setValue(
        currentSeasons.filter(s => s !== checkbox.value)
      );
    }
  }


}
