import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterModule } from '@angular/router';

import { CoordinatorEnrollment } from '../../Service/coordinator-enrollment';


@Component({
  selector: 'app-login-to-coordinator',

  imports: [
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl: './login-to-coordinator.html',
  styleUrl: './login-to-coordinator.scss',
})


export class LoginToCoordinator {

  showPassword = false;

  constructor(
    private coordinatorService: CoordinatorEnrollment
  ) { }


  CoordinatorForm = new FormGroup({

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

    Title: new FormControl('', [
      Validators.required
    ]),

    Phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^0\d{8,9}$/)
    ]),

    Email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    UserName: new FormControl('', [
      Validators.required
    ]),

    Password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ]),

    InstitutionName: new FormControl('', [
      Validators.required
    ]),

    InstitutionCity: new FormControl('', [
      Validators.required
    ]),

    InstitutionPhon: new FormControl('', [
      Validators.required,
      Validators.pattern(/^0\d{8,9}$/)
    ]),

    PrincipalName: new FormControl('', [
      Validators.required
    ]),

    InstitutionType: new FormControl('', [
      Validators.required
    ]),

    AgeGroup: new FormControl('', [
      Validators.required
    ]),

    Gender: new FormControl('', [
      Validators.required
    ])

  });


  // =========================================
  // הצגת / הסתרת סיסמה
  // =========================================

  togglePasswordVisibility() {

    this.showPassword =
      !this.showPassword;

  }


  // =========================================
  // שליחת הטופס
  // =========================================

  submitCoordinatorForm() {

    if (this.CoordinatorForm.invalid) {

      this.CoordinatorForm.markAllAsTouched();

      return;
    }


    const formData = new FormData();


    // =========================================
    // פרטים אישיים
    // =========================================

    formData.append(
      'FirsName',
      this.CoordinatorForm.controls.FirsName.value ?? ''
    );

    formData.append(
      'LastName',
      this.CoordinatorForm.controls.LastName.value ?? ''
    );

    formData.append(
      'Title',
      this.CoordinatorForm.controls.Title.value ?? ''
    );

    formData.append(
      'Phon',
      this.CoordinatorForm.controls.Phone.value ?? ''
    );

    formData.append(
      'Email',
      this.CoordinatorForm.controls.Email.value ?? ''
    );


    // =========================================
    // פרטי התחברות
    // =========================================

    formData.append(
      'UserName',
      this.CoordinatorForm.controls.UserName.value ?? ''
    );

    formData.append(
      'Password',
      this.CoordinatorForm.controls.Password.value ?? ''
    );


    // =========================================
    // פרטי מוסד
    // =========================================

    formData.append(
      'InstitutionName',
      this.CoordinatorForm.controls.InstitutionName.value ?? ''
    );

    formData.append(
      'InstitutionCity',
      this.CoordinatorForm.controls.InstitutionCity.value ?? ''
    );

    formData.append(
      'InstitutionPhon',
      this.CoordinatorForm.controls.InstitutionPhon.value ?? ''
    );

    formData.append(
      'PrincipalName',
      this.CoordinatorForm.controls.PrincipalName.value ?? ''
    );

    formData.append(
      'InstitutionType',
      this.CoordinatorForm.controls.InstitutionType.value ?? ''
    );

    formData.append(
      'AgeGroup',
      this.CoordinatorForm.controls.AgeGroup.value ?? ''
    );

    formData.append(
      'Gender',
      this.CoordinatorForm.controls.Gender.value ?? ''
    );


    // =========================================
    // שליחה לשרת
    // =========================================

    this.coordinatorService
      .registerCoordinator(formData)
      .subscribe({

        next: response => {

          console.log(
            'הרכזת נרשמה בהצלחה',
            response
          );

          alert(
            'ההרשמה נשלחה בהצלחה!'
          );

          this.CoordinatorForm.reset();

        },


        error: error => {

          console.error(
            'שגיאה בהרשמת הרכזת',
            error
          );

          alert(
            'אירעה שגיאה בשליחת הטופס'
          );

        }

      });

  }

}