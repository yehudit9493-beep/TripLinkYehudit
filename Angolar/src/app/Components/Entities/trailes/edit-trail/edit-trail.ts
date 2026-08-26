import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Trail } from '../../../../Interfacess/Trail';
import { TrailsService } from '../../../../Service/TrailsService';

@Component({
  selector: 'app-edit-trail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trail.html',
  styleUrl: './edit-trail.scss',
  standalone: true
})
export class EditTrail implements OnChanges {

  @Input() trail!: Trail;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Trail>();

 existingImages: string[] = [];
  newImageFiles: File[] = []; 
  previewUrls: string[] = []; 
  isSaving: boolean = false;

  editTrailForm = new FormGroup({
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
  })

  constructor(private trailsService: TrailsService, private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trail'] && this.trail) {
      this.editTrailForm.patchValue({
        name: this.trail.name,
        describshain: this.trail.describshain,
        regionId: this.trail.regionId,
        directions: this.trail.directions,
        RouteLengthInKM: this.trail.RouteLengthInKM,
        RouteDuration: this.trail.RouteDuration,
        DifficultyLevel: this.trail.DifficultyLevel,
        minimumAge: this.trail.minimumAge,
        MaximumAge: this.trail.MaximumAge,
        WetDryTrack: this.trail.WetDryTrack,
        season: this.trail.season,
      });

      this.existingImages = this.trail.images || [];
    }
  }
  onSubmit(): void {
    if (this.editTrailForm.valid) {
      const updatedTrail: Trail = {
        id: this.trail.id,
        ...this.editTrailForm.value as unknown as Omit<Trail, 'id'>,
        images: this.existingImages
      };


      if (this.newImageFiles.length > 0) {
        this.uploadNewImages(updatedTrail);
      } else {
        this.saveTrail(updatedTrail);
      }
    }
  }

  uploadNewImages(updatedTrail: Trail): void {
    const formData = new FormData();

    this.newImageFiles.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('trailId', updatedTrail.id.toString());

    this.trailsService.uploadImages(formData).subscribe({
      next: (response: any) => {
        updatedTrail.images = [...this.existingImages, ...response.imagePaths];
        this.saveTrail(updatedTrail);
      },

      error: (error) => {
        console.error('שגיאה בהעלאת תמונות:', error);
      }
    });
  }

  saveTrail(updatedTrail: Trail): void {
    this.trailsService.UpdateTrail(updatedTrail).subscribe({
      next: (data) => {
        this.updated.emit(data);
        this.closed.emit();
      },
      error: (error) => {
        console.error('שגיאה בעדכון המסלול:', error);
      }
    });
  }

  onSeasonChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const currentSeasons: string[] = this.editTrailForm.get('season')?.value || [];

    if (checkbox.value === 'כל השנה' && checkbox.checked) {

      this.editTrailForm.get('season')?.setValue(['כל השנה']);
    } else if (checkbox.checked) {

      const newSeasons = [...currentSeasons.filter(s => s !== 'כל השנה'), checkbox.value];
      this.editTrailForm.get('season')?.setValue(newSeasons);
    } else {

      this.editTrailForm.get('season')?.setValue(
        currentSeasons.filter(s => s !== checkbox.value)
      );
    }
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
  }

  removeNewImage(index: number): void {
    this.newImageFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  clearFileInput(input: HTMLInputElement): void {
    input.value = '';
    this.newImageFiles = [];
    this.previewUrls = [];
  }

}



