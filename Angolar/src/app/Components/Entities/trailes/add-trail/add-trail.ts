import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrailsService } from '../../../../Service/TrailsService';
import { TrailWithoutId } from '../../../../Interfacess/Trail';
import { CommonModule } from '@angular/common';
import { Regions } from '../../../../Service/regions';
import { ApiUrl } from '../../../../Service/api-url';

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
    private regions: Regions, private cdr: ChangeDetectorRef,
    private apiUrl: ApiUrl
  ) { this.areaList = this.regions.getAllAreas(); }

  getImageUrl(image: string): string {
    return this.apiUrl.getImageUrl(image);
  }

  addTrailForm = new FormGroup({
    name: new FormControl('', Validators.required),
    describshain: new FormControl(''),
    regionId: new FormControl('', Validators.required),
    directions: new FormControl(''),
    RouteLengthInKM: new FormControl('', [Validators.required, Validators.min(0.1)]),
    RouteDuration: new FormControl('', Validators.required),
    DifficultyLevel: new FormControl('', Validators.required),
    minimumAge: new FormControl('', [Validators.required, Validators.min(0)]),
    MaximumAge: new FormControl('', [Validators.required, Validators.min(0)]),
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

  // בונה את אובייקט המסלול מתוך הטופס, תוך המרה של השדות המספריים
  private buildTrailPayload(extra?: any): TrailWithoutId {
    const v = this.addTrailForm.value;
    return {
      name: v.name ?? '',
      describshain: v.describshain ?? '',
      regionId: Number(v.regionId),
      directions: v.directions ?? '',
      RouteLengthInKM: Number(v.RouteLengthInKM),
      RouteDuration: v.RouteDuration ?? '',
      DifficultyLevel: v.DifficultyLevel ?? '',
      minimumAge: Number(v.minimumAge),
      MaximumAge: Number(v.MaximumAge),
      WetDryTrack: v.WetDryTrack ?? '',
      season: v.season ?? [],
      images: extra?.images,
      ...(extra ?? {})
    };
  }

  onSubmit() {
    // מסמנים את כל השדות כ"נגעו" כדי שכל הודעות השגיאה יופיעו
    this.addTrailForm.markAllAsTouched();

    if (this.addTrailForm.valid) {
      if (this.newImageFiles.length > 0) {
        this.uploadNewImages();
      } else {
        this.saveTrail();
      }
    } else {
      console.warn('טופס אינו תקין; ממויינים השדות החסרים בצבע אדום');
    }
  }

  uploadNewImages(): void {
    this.isSaving = true;
    const formData = new FormData();

    this.newImageFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.trailService.uploadImages(formData).subscribe({
      next: (response: any) => {
        const trailData = this.buildTrailPayload({ images: response.imagePaths ?? [] });
        this.saveTrailWithImages(trailData);
      },
      error: (error) => {
        console.error('שגיאה בהעלאת תמונות:', error);
        this.isSaving = false;
      }
    });
  }

  saveTrailWithImages(trailData: any): void {
    const trail = this.buildTrailPayload({ images: trailData?.images ?? this.previewUrls });
    this.trailService.addTrail(trail).subscribe({
      next: (response) => {
        console.log('מסלול נוסף בהצלחה עם תמונות');
        this.addTrailForm.reset();
        this.newImageFiles = [];
        this.previewUrls = [];
        this.isSaving = false;
        this.updated.emit(response);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בהוספת המסלול:', error);
        this.isSaving = false;
      }
    });
  }

  saveTrail(): void {
    this.isSaving = true;
    this.trailService.addTrail(this.buildTrailPayload()).subscribe({
      next: (response) => {
        console.log('מסלול נוסף בהצלחה');
        this.addTrailForm.reset();
        this.isSaving = false;
        this.updated.emit(response);
        this.closed.emit();
      },
      error: (error: any) => {
        console.error('שגיאה בהוספת המסלול:', error);
        console.error('💥 הודעת השרת המלאה:', error?.error?.message ?? error?.message ?? error?.statusText);
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

  onSeasonChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const currentSeasons: string[] = this.addTrailForm.get('season')?.value || [];

    // מסמנים שדה העונה כ"נגע" כדי שההודעה 'יש לבחור עונה' תופיע אם אין בחירה
    this.addTrailForm.get('season')?.markAsTouched();

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
