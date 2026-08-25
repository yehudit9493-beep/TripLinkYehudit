import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-to-guide',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login-to-guide.html',
  styleUrl: './login-to-guide.scss',
})
export class LoginToGuide {

  GuideForm = new FormGroup({

    FirsName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    Id: new FormControl('', [Validators.required]),
    PCountryOfOriginhon: new FormControl('', [Validators.required]),
    ReligiousAffiliation: new FormControl('', [Validators.required]),
    // Status: new FormControl(false, [Validators.required]),
    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    City: new FormControl('', [Validators.required]),
    TrainingAreas: new FormControl('', [Validators.required]),
    CvFile: new FormControl(null),
    Certificates: new FormControl(null)

  })

  onCvSelected(event: any) {
    const file = event.target.files[0];

    this.GuideForm.patchValue({
      CvFile: file
    });
  }

  onCertificatesSelected(event: any) {
    const files = event.target.files;

    this.GuideForm.patchValue({
      Certificates: files
    });
  }

}
