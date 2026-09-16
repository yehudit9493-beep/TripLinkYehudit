import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { CoordinatorEnrollment } from '../../Service/coordinator-enrollment';
import { Auth } from '../../Service/auth';


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

  // האם הגענו דרך "עריכת פרופיל" בהדר (לעומת הרשמה חדשה)
  isEditMode = false;

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
    private authService: Auth,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // טעינת רשימת הערים למילוי שדה העיר
    this.coordinatorService.getCities().subscribe({
      next: (data) => (this.citiesList = data),
      error: (e) => console.error('שגיאה בטעינת ערים', e),
    });

    // זיהוי מצב עריכה: הגענו עם param mode=edit (מההדר)
    this.isEditMode = this.route.snapshot.queryParamMap.get('mode') === 'edit';

    if (this.isEditMode) {
      this.loadProfile();
    }
  }

  // =========================================
  // טעינת פרופיל הרכזת ומילוי הטופס (מצב עריכה)
  // =========================================
  private loadProfile(): void {
    const userId = this.authService.getCurrentUserId();

    this.coordinatorService.getProfile(userId).subscribe({
      next: (profile) => {
        this.CoordinatorForm.patchValue({
          FirsName: profile.firstName,
          LastName: profile.lastName,
          Title: profile.title,
          Phone: profile.phone,
          Email: profile.email,
          UserName: profile.userName,
          Password: profile.password,
          InstitutionName: profile.institutionName,
          InstitutionCity: profile.institutionCity,
          InstitutionPhon: profile.institutionPhone,
          PrincipalName: profile.principalName,
          InstitutionType: profile.institutionType,
          AgeGroup: profile.ageGroup,
          Gender: profile.gender
        });
      },
      error: (e) => {
        console.error('שגיאה בטעינת פרופיל הרכזת', e);
        this.showToast('אירעה שגיאה בטעינת הפרטים', 'error');
      }
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
  // בניית FormData מערכי הטופס
  // =========================================

  private buildFormData(): FormData {

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

    return formData;
  }


  // =========================================
  // שליחת הטופס (הרשמה חדשה או עריכה)
  // =========================================

  // תוויות עבריות לשדות - להצגת הודעות תקינות ברורות
  private readonly fieldLabels: Record<string, string> = {
    FirsName: 'שם פרטי',
    LastName: 'שם משפחה',
    Title: 'תפקיד במוסד',
    Phone: 'טלפון',
    Email: 'כתובת אימייל',
    UserName: 'שם משתמש',
    Password: 'סיסמה',
    InstitutionName: 'שם המוסד',
    InstitutionCity: 'עיר',
    InstitutionPhon: 'טלפון מזכירות',
    PrincipalName: 'שם מנהל/ת',
    InstitutionType: 'סוג מוסד',
    AgeGroup: 'שכבת גיל',
    Gender: 'מגדר'
  };

  submitCoordinatorForm() {

    if (this.CoordinatorForm.invalid) {

      // איתור השדות הבעייתיים להצגה מדויקת
      const invalidFields = Object.keys(this.CoordinatorForm.controls)
        .filter(key => this.CoordinatorForm.get(key)?.invalid)
        .map(key => this.fieldLabels[key] ?? key);

      this.showToast(
        invalidFields.length > 0
          ? 'יש לתקן את השדות: ' + invalidFields.join(', ')
          : 'יש למלא את כל שדות החובה',
        'error'
      );

      this.CoordinatorForm.markAllAsTouched();

      return;
    }

    const formData = this.buildFormData();

    const userId = this.authService.getCurrentUserId();

    const request = this.isEditMode
      ? this.coordinatorService.updateProfile(userId, formData)
      : this.coordinatorService.registerCoordinator(formData);

    // =========================================
    // שליחה לשרת
    // =========================================

    request.subscribe({

      next: response => {

        console.log(
          this.isEditMode ? 'הפרופיל עודכן בהצלחה' : 'הרכזת נרשמה בהצלחה',
          response
        );

        this.showToast(
          this.isEditMode ? 'הפרטים נשמרו בהצלחה!' : 'ההרשמה נשלחה בהצלחה!',
          'success'
        );

        this.CoordinatorForm.reset();

        // במצב עריכה נחזור לדף הבית, אחרת לדף הנחיתה
        const target = this.isEditMode ? ['/home-page'] : ['/'];
        setTimeout(() => this.router.navigate(target), 1300);

      },


      error: error => {

        console.error(
          this.isEditMode ? 'שגיאה בעדכון הפרופיל' : 'שגיאה בהרשמת הרכזת',
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