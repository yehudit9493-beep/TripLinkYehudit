import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Enrollment } from '../../Service/enrollment';

@Component({
  selector: 'app-login-to-guide',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login-to-guide.html',
  styleUrl: './login-to-guide.scss',
})
export class LoginToGuide {

  showPassword = false;

  selectedCvName: string = '';
  selectedCertificateNames: string[] = [];

  constructor(private enrollmentService: Enrollment) { }

  GuideForm = new FormGroup({

    FirsName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(/^[א-תa-zA-Z\s]+$/)
    ]),

    LastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(/^[א-תa-zA-Z\s]+$/)
    ]),
    Id: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{9}$/)
    ]),
    PCountryOfOriginhon: new FormControl('', [Validators.required]),
    ReligiousAffiliation: new FormControl('', [Validators.required]),
    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    City: new FormControl('', [Validators.required]),
    TrainingAreas: new FormControl('', [Validators.required]),
    CvFile: new FormControl<File | null>(null, [
      Validators.required
    ]),

    Certificates: new FormControl<File[] | null>(null, [
      Validators.required
    ])

  })

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onCvSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      const file = input.files[0];

      this.GuideForm.patchValue({
        CvFile: file
      });

      // שמירת שם הקובץ להצגה
      this.selectedCvName = file.name;
    }
  }


  onCertificatesSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      const files = Array.from(input.files);

      this.GuideForm.patchValue({
        Certificates: files
      });

      this.selectedCertificateNames =
        files.map(file => file.name);
    }
  }

  removeCv() {

    this.selectedCvName = '';

    this.GuideForm.patchValue({
      CvFile: null
    });

  }

  removeCertificate(fileName: string) {

    this.selectedCertificateNames =
      this.selectedCertificateNames.filter(
        name => name !== fileName
      );

    const currentFiles =
      this.GuideForm.controls.Certificates.value;

    if (currentFiles) {

      const remainingFiles =
        currentFiles.filter(
          file => file.name !== fileName
        );

      this.GuideForm.patchValue({
        Certificates:
          remainingFiles.length > 0
            ? remainingFiles
            : null
      });

    }

  }

  submitGuideForm() {

    if (this.GuideForm.invalid) {

      this.GuideForm.markAllAsTouched();
      
      return;
    }

    const cvFile =
      this.GuideForm.controls.CvFile.value;

    const certificates =
      this.GuideForm.controls.Certificates.value;

    if (!cvFile) {
      alert('יש להעלות קורות חיים');
      return;
    }

    if (!certificates || certificates.length === 0) {
      alert('יש להעלות לפחות תעודת הכשרה אחת');
      return;
    }


    const formData = new FormData();


    // =========================
    // פרטים אישיים
    // =========================

    formData.append(
      'FirsName',
      this.GuideForm.controls.FirsName.value ?? ''
    );

    formData.append(
      'LastName',
      this.GuideForm.controls.LastName.value ?? ''
    );

    formData.append(
      'Id',
      this.GuideForm.controls.Id.value ?? ''
    );

    formData.append(
      'PCountryOfOriginhon',
      this.GuideForm.controls.PCountryOfOriginhon.value ?? ''
    );

    formData.append(
      'ReligiousAffiliation',
      this.GuideForm.controls.ReligiousAffiliation.value ?? ''
    );


    // =========================
    // פרטי התחברות
    // =========================

    formData.append(
      'UserName',
      this.GuideForm.controls.UserName.value ?? ''
    );

    formData.append(
      'Password',
      this.GuideForm.controls.Password.value ?? ''
    );


    // =========================
    // פרטים נוספים
    // =========================

    formData.append(
      'City',
      this.GuideForm.controls.City.value ?? ''
    );

    formData.append(
      'TrainingAreas',
      this.GuideForm.controls.TrainingAreas.value ?? ''
    );


    // =========================
    // קורות חיים
    // =========================

    formData.append(
      'CvFile',
      cvFile
    );


    // =========================
    // תעודות
    // =========================

    certificates.forEach(file => {

      formData.append(
        'Certificates',
        file
      );

    });


    // =========================
    // שליחה לשרת
    // =========================

    this.enrollmentService
      .registerGuide(formData)
      .subscribe({

        next: response => {

          console.log(
            'המדריכה נרשמה בהצלחה',
            response
          );

          alert('ההרשמה נשלחה בהצלחה!');

        },

        error: error => {

          console.error(
            'שגיאה בהרשמת המדריכה',
            error
          );

          alert(
            'אירעה שגיאה בשליחת הטופס'
          );

        }

      });

  }

}
