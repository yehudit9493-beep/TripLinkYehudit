import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

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


export class LoginToCoordinator implements OnInit {

  showPassword = false;

  // רשימת הערים למילוי שדה העיר (נטען מהשרת)
  citiesList: string[] = [];

  // =========================
  // הודעות (טוסט) - מוחלפות במקום alert
  // =========================
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  toastVisible = false;

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3500) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toastVisible = false), duration);
  }

  constructor(
    private coordinatorService: CoordinatorEnrollment,
    private router: Router
  ) { }

  ngOnInit(): void {
    // טעינת רשימת הערים למילוי שדה העיר
    this.coordinatorService.getCities().subscribe({
      next: (data) => (this.citiesList = data),
      error: (e) => console.error('שגיאה בטעינת ערים', e),
    });
  }


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

      this.showToast('יש למלא את כל שדות החובה', 'error');

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

          this.showToast('ההרשמה נשלחה בהצלחה!', 'success');

          this.CoordinatorForm.reset();

          // חזרה לדף הנחיתה
          setTimeout(() => this.router.navigate(['/']), 1300);

        },


        error: error => {

          console.error(
            'שגיאה בהרשמת הרכזת',
            error
          );

          // הודעת השגיאה האמיתית מהשרת (אם קיימת)
          const serverMessage = error?.error?.message;
          this.showToast(
            serverMessage ? serverMessage : 'אירעה שגיאה בשליחת הטופס',
            'error'
          );

        }

      });

  }

}