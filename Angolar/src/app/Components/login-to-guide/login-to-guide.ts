import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Enrollment } from '../../Service/enrollment';
import { Auth } from '../../Service/auth';

@Component({
  selector: 'app-login-to-guide',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login-to-guide.html',
  styleUrl: './login-to-guide.scss',
})
export class LoginToGuide implements OnInit {

  showPassword = false;

  // מצב עריכה - true אם מגיעים מהדר (עריכת פרופיל) ולא מהרשמה חדשה
  isEditMode = false;

  // מזהה המדריכה בעת עריכה (מהמשתמש המחובר)
  guideId: number | null = null;

  selectedCvName: string = '';
  selectedCertificateNames: string[] = [];

  // קבצים קיימים של המדריכה (מהפרופיל) להורדה/השלמה
  existingCvFiles: { fileId: number; fileName: string; filePath: string }[] = [];
  existingCertFiles: { fileId: number; fileName: string; filePath: string }[] = [];

  // בסיס ה-URL לגישה לקבצים (ללא "/api/Guide")
  fileBaseUrl = 'https://localhost:7216';

  // נתוני ה-selectים שנטען מהשרת (השרת מחזיר camelCase)
  religiousList: { religiousId: number; religiousName: string }[] = [];
  areasList: { areaId: number; areaName: string }[] = [];
  citiesList: string[] = [];

  // חיפוש ערים
  citySearch: string = '';

  constructor(
    private enrollmentService: Enrollment,
    private authService: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.enrollmentService.getReligious().subscribe({
      next: (data) => (this.religiousList = data),
      error: (e) => console.error('שגיאה בטעינת השתייכות דתית', e),
    });

    this.enrollmentService.getAreas().subscribe({
      next: (data) => (this.areasList = data),
      error: (e) => console.error('שגיאה בטעינת אזורי הכשרה', e),
    });

    this.enrollmentService.getCities().subscribe({
      next: (data) => (this.citiesList = data),
      error: (e) => console.error('שגיאה בטעינת ערים', e),
    });

    // אם יש משתמש מחובר - מדובר בעריכת פרופיל (מגיעים מהדר)
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userId) {
      this.isEditMode = true;
      this.guideId = currentUser.userId;
      this.loadProfileForEdit(this.guideId);
    }
  }

  // =====================
  // מצב עריכה - מילוי הטופס בפרטי הפרופיל הקיימים
  // =====================
  private loadProfileForEdit(guideId: number): void {
    this.enrollmentService.getGuideProfile(guideId).subscribe({
      next: (profile) => {
        // הקבצים אינם שדות חובה בעריכה - מאפשרים לעדכן בלי להעלות שוב
        this.makeFilesOptional();

        this.GuideForm.patchValue({
          FirsName: profile.firstName,
          LastName: profile.lastName,
          Id: profile.identityCard,
          PCountryOfOriginhon: profile.countryOfOrigin,
          ReligiousAffiliation: profile.religiousId,
          UserName: profile.userName,
          Password: profile.password ?? '',   // מאפשר לראות/לשנות סיסמה
          City: profile.city,
          TrainingAreas: profile.trainingAreas ?? [],
          Phone: profile.phone,
          Email: profile.email,
          YearsOfExperience: profile.yearsOfExperience,
        });

        // הצגת הקבצים הקיימים לפי סוגם
        this.existingCvFiles = profile.files?.filter((f: any) => f.kind === 'cv') ?? [];
        this.existingCertFiles = profile.files?.filter((f: any) => f.kind === 'cert') ?? [];
      },
      error: (e) => {
        console.error('שגיאה בטעינת פרטי הפרופיל', e);
        this.showToast('שגיאה בטעינת פרטי הפרופיל', 'error');
      },
    });
  }

  // בעריכה אין צורך להעלות מחדש קורות חיים ותעודות
  private makeFilesOptional(): void {
    const cv = this.GuideForm.controls.CvFile;
    const certs = this.GuideForm.controls.Certificates;
    const password = this.GuideForm.controls.Password;

    cv.setValidators([]);
    certs.setValidators([]);
    password.setValidators([]);

    cv.updateValueAndValidity();
    certs.updateValueAndValidity();
    password.updateValueAndValidity();
  }

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

    // שיוך דתי - select יחיד (ערך = ReligiousId)
    ReligiousAffiliation: new FormControl('', [Validators.required]),

    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),

    // עיר - select יחיד (ערך = שם העיר)
    City: new FormControl('', [Validators.required]),

    // אזורי הכשרה - select מרובה (ערך = מערך של AreaId, נשלח מופרד בפסיקים)
    TrainingAreas: new FormControl<number[]>([], [Validators.required]),

    // טלפון
    Phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9+\-\s]{9,15}$/)
    ]),

    // אימייל
    Email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    // שנות ניסיון
    YearsOfExperience: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),

    CvFile: new FormControl<File | null>(null, [Validators.required]),

    Certificates: new FormControl<File[] | null>(null, [Validators.required])
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

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

  // =========================
  // חיפוש ערים - מסנן לפי הטקסט שהוקלד
  // =========================
  get filteredCities(): string[] {
    const query = this.citySearch.trim().toLowerCase();
    if (!query) return this.citiesList;
    return this.citiesList.filter((c) => c.toLowerCase().includes(query));
  }

  // =========================
  // בחירת אזורי הכשרה - הוספה/הסרה לפי לחיצה
  // =========================
  toggleArea(areaId: number) {
    const selected = this.GuideForm.controls.TrainingAreas.value ?? [];
    const index = selected.indexOf(areaId);

    if (index >= 0) {
      // מסירים את האזור שנבחר
      selected.splice(index, 1);
    } else {
      // מוסיפים את האזור
      selected.push(areaId);
    }

    this.GuideForm.controls.TrainingAreas.setValue([...selected]);
  }

  isAreaSelected(areaId: number): boolean {
    return (this.GuideForm.controls.TrainingAreas.value ?? []).includes(areaId);
  }

  onCvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.GuideForm.patchValue({ CvFile: file });
      this.selectedCvName = file.name;
    }
  }

  onCertificatesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.GuideForm.patchValue({ Certificates: files });
      this.selectedCertificateNames = files.map((file) => file.name);
    }
  }

  removeCv() {
    this.selectedCvName = '';
    this.GuideForm.patchValue({ CvFile: null });
  }

  removeCertificate(fileName: string) {
    this.selectedCertificateNames = this.selectedCertificateNames.filter((name) => name !== fileName);
    const currentFiles = this.GuideForm.controls.Certificates.value;
    if (currentFiles) {
      const remainingFiles = currentFiles.filter((file) => file.name !== fileName);
      this.GuideForm.patchValue({
        Certificates: remainingFiles.length > 0 ? remainingFiles : null,
      });
    }
  }

  submitGuideForm() {
    if (this.GuideForm.invalid) {
      this.GuideForm.markAllAsTouched();
      return;
    }

    const cvFile = this.GuideForm.controls.CvFile.value;
    const certificates = this.GuideForm.controls.Certificates.value;
    const trainingAreaIds = this.GuideForm.controls.TrainingAreas.value;

    if (!trainingAreaIds || trainingAreaIds.length === 0) {
      this.showToast('יש לבחור לפחות אזור הכשרה אחד', 'error');
      return;
    }

    // במצב עריכה - הקבצים לאו דווקא מועלים מחדש
    if (this.isEditMode) {
      this.submitProfileUpdate();
      return;
    }

    if (!cvFile) {
      this.showToast('יש להעלות קורות חיים', 'error');
      return;
    }

    if (!certificates || certificates.length === 0) {
      this.showToast('יש להעלות לפחות תעודת הכשרה אחת', 'error');
      return;
    }

    const formData = new FormData();

    // =========================
    // פרטים אישיים
    // =========================
    formData.append('FirstName', this.GuideForm.controls.FirsName.value ?? '');
    formData.append('LastName', this.GuideForm.controls.LastName.value ?? '');
    formData.append('Id', this.GuideForm.controls.Id.value ?? '');
    formData.append('CountryOfOrigin', this.GuideForm.controls.PCountryOfOriginhon.value ?? '');

    // שיוך דתי - נשלח ה-ID המספרי
    formData.append('ReligiousAffiliation', this.GuideForm.controls.ReligiousAffiliation.value ?? '');

    // =========================
    // פרטי התחברות
    // =========================
    formData.append('UserName', this.GuideForm.controls.UserName.value ?? '');
    formData.append('Password', this.GuideForm.controls.Password.value ?? '');

    // =========================
    // פרטים נוספים
    // =========================
    formData.append('City', this.GuideForm.controls.City.value ?? '');

    // אזורי הכשרה - נשלחים כ-IDs מופרדים בפסיקים
    formData.append('TrainingAreas', trainingAreaIds.join(','));

    // =========================
    // פרטי קשר וניסיון
    // =========================
    formData.append('Phone', this.GuideForm.controls.Phone.value ?? '');
    formData.append('Email', this.GuideForm.controls.Email.value ?? '');
    formData.append('YearsOfExperience', String(this.GuideForm.controls.YearsOfExperience.value ?? 0));

    // =========================
    // קורות חיים
    // =========================
    formData.append('CvFile', cvFile);

    // =========================
    // תעודות
    // =========================
    certificates.forEach((file) => {
      formData.append('Certificates', file);
    });

    // =========================
    // שליחה לשרת
    // =========================
    this.enrollmentService.registerGuide(formData).subscribe({
      next: (response) => {
        console.log('המדריכה נרשמה בהצלחה', response);
        this.showToast('ההרשמה נשלחה בהצלחה!', 'success');
        // חזרה לדף הנחיתה
        setTimeout(() => this.router.navigate(['/']), 1300);
      },
      error: (error) => {
        console.error('שגיאה בהרשמת המדריכה', error);
        // השרת מחזיר { message: "...", errors: [...] } - מציגים את הודעת השגיאה האמיתית
        const serverMessage = error?.error?.message;
        const detail = Array.isArray(error?.error?.errors)
          ? error.error.errors[0]
          : '';
        const message = serverMessage
          ? detail && !serverMessage.includes(detail)
            ? `${serverMessage} : ${detail}`
            : serverMessage
          : 'אירעה שגיאה בשליחת הטופס';
        this.showToast(message, 'error');
      },
    });
  }

  // =========================
  // שליחת עדכון הפרופיל (מצב עריכה)
  // =========================
  private submitProfileUpdate() {
    if (this.guideId == null) {
      this.showToast('מזהה המדריכה חסר', 'error');
      return;
    }

    const trainingAreaIds = this.GuideForm.controls.TrainingAreas.value ?? [];
    const password = this.GuideForm.controls.Password.value ?? '';
    const cvFile = this.GuideForm.controls.CvFile.value;
    const certificates = this.GuideForm.controls.Certificates.value;

    const formData = new FormData();

    // פרטים אישיים
    formData.append('FirstName', this.GuideForm.controls.FirsName.value ?? '');
    formData.append('LastName', this.GuideForm.controls.LastName.value ?? '');
    formData.append('IdentityCard', this.GuideForm.controls.Id.value ?? '');
    formData.append('CountryOfOrigin', this.GuideForm.controls.PCountryOfOriginhon.value ?? '');
    formData.append('Religious', this.GuideForm.controls.ReligiousAffiliation.value ?? '');

    // פרטי התחברות - סיסמה רק אם הוזנה חדשה
    formData.append('UserName', this.GuideForm.controls.UserName.value ?? '');
    formData.append('Password', password);

    // פרטים נוספים
    formData.append('City', this.GuideForm.controls.City.value ?? '');
    formData.append('TrainingAreas', trainingAreaIds.join(','));

    // פרטי קשר וניסיון
    formData.append('Phone', this.GuideForm.controls.Phone.value ?? '');
    formData.append('Email', this.GuideForm.controls.Email.value ?? '');
    formData.append('YearsOfExperience', String(this.GuideForm.controls.YearsOfExperience.value ?? 0));

    // קבצים אופציונליים - רק אם הועלו חדשים
    if (cvFile) {
      formData.append('CvFile', cvFile);
    }
    if (certificates && certificates.length > 0) {
      certificates.forEach((file) => {
        formData.append('Certificates', file);
      });
    }

    this.enrollmentService.updateGuideProfile(this.guideId, formData).subscribe({
      next: () => {
        console.log('הפרופיל עודכן בהצלחה');
        this.showToast('הפרטים נשמרו בהצלחה!', 'success');
        // חזרה לעמוד הבית
        setTimeout(() => this.router.navigate(['/home-page']), 1300);
      },
      error: (error) => {
        console.error('שגיאה בעדכון הפרופיל', error);
        // הדפסה מפורטת לעזרת דיבוג
        console.error('תשובת השרת:', error?.error);
        const serverMessage = error?.error?.message;
        const detail = Array.isArray(error?.error?.errors)
          ? error.error.errors[0]
          : '';
        const message = serverMessage
          ? detail && !serverMessage.includes(detail)
            ? `${serverMessage} : ${detail}`
            : serverMessage
          : 'אירעה שגיאה בעדכון הפרטים';
        this.showToast(message, 'error');
      },
    });
  }
}