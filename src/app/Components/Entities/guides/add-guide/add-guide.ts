import { Component, EventEmitter, Output } from '@angular/core';
import { GuideService } from '../../../../Service/guide-service';
import { GuideWithoutId } from '../../../../Interfacess/guides';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Regions } from '../../../../Service/regions';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-guide',
  imports: [CommonModule, ReactiveFormsModule,  MatSelectModule, MatFormFieldModule],
  templateUrl: './add-guide.html',
  styleUrl: './add-guide.scss',
  standalone: true
})
export class AddGuide {

  constructor(private guideService: GuideService,
    private regions: Regions) 
    { this.areaList = this.regions.getAllAreas();}

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<GuideWithoutId>();

  areaList: { id: number, name: string }[] = [];

  addGuideForm = new FormGroup({
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

  onSubmit() {
    if (this.addGuideForm.valid) {
      this.guideService.addGuide(this.addGuideForm.value as GuideWithoutId).subscribe({
        next: (response) => {
          console.log('המדריך נוסף בהצלחה:', response.message);
          this.addGuideForm.reset();
          this.updated.emit(this.addGuideForm.value as GuideWithoutId);
          this.closed.emit();
        },
        error: (error) => {
          console.error('שגיאה בהוספת המדריכה:', error);
        }
      });
    } else {
      console.warn('הטופס אינו תקין; אנא בדוק את השדות');
    }
  }
}
