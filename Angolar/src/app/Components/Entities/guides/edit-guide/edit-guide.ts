import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Guides } from '../../../../Interfacess/guides';
import { GuideService } from '../../../../Service/guide-service';
import { Regions } from '../../../../Service/regions';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-edit-guide',
  imports: [CommonModule, ReactiveFormsModule,  MatSelectModule, MatFormFieldModule],
  templateUrl: './edit-guide.html',
  styleUrl: './edit-guide.scss',
  standalone: true
})
export class EditGuide implements OnChanges {

  @Input() guide!: Guides;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Guides>();

  areaList: { id: number, name: string }[] = [];

  editGuideForm = new FormGroup({
    name: new FormControl('', Validators.required),
    trainingRegionsId: new FormControl<number[]>([], Validators.required),
    licenseNumber: new FormControl(''),
    phoneNumber: new FormControl(''),
    email: new FormControl(''),
    specialization: new FormControl(''),
    yearsOfExperience: new FormControl(0, Validators.required),
    status: new FormControl(false),
    ReligiousAffiliation: new FormControl('')

  });

  constructor(private guideService: GuideService,
    private regions: Regions) { this.areaList = this.regions.getAllAreas(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['guide'] && this.guide) {
      this.editGuideForm.patchValue({
        name: this.guide.name,
        trainingRegionsId: this.guide.trainingRegionsId,
        licenseNumber: this.guide.licenseNumber,
        phoneNumber: this.guide.phoneNumber,
        email: this.guide.email,
        specialization: this.guide.specialization,
        yearsOfExperience: this.guide.yearsOfExperience,
        status: this.guide.status,
        ReligiousAffiliation: this.guide.ReligiousAffiliation
      });
    }
  }

  onSubmit(): void {
    if (this.editGuideForm.valid) {
      const updatedGuide: Guides = {
        id: this.guide.id,
        ...this.editGuideForm.value as unknown as Omit<Guides, 'id'>
      };
      this.guideService.UpdateGuide(updatedGuide).subscribe({
        next: (data) => {
          this.updated.emit(data);
          this.closed.emit();
        }
      });
    }
  }
}
