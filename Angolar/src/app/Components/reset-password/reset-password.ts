// import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialog } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { NewPassword } from '../new-password/new-password';
// import { RouterModule } from '@angular/router';

// export interface DialogData {
//   animal: string;
// }

// @Component({
//   selector: 'app-reset-password',
//   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, RouterModule],
//   templateUrl: './reset-password.html',
//   styleUrl: './reset-password.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   standalone: true
// })

// export class ResetPassword {

//   PasswordForm = new FormGroup({
//     UserName: new FormControl('', [Validators.required]),
//     Email: new FormControl('', [Validators.required, Validators.email]),
//     Phon: new FormControl('', [Validators.required]),

//   })

//   readonly animal = signal('');
//   readonly dialog = inject(MatDialog);

//   openDialog(): void {
//     const dialogRef = this.dialog.open(NewPassword, {
//       data: { animal: this.animal() },
//       width: '460px',
//       maxWidth: 'calc(100vw - 30px)',
//       panelClass: 'new-password-panel'
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result !== undefined) {
//         this.animal.set(result);
//       }
//     });
//   }

// }



import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { Auth } from '../../Service/auth';
import { NewPassword } from '../new-password/new-password';


@Component({
  selector: 'app-reset-password',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl: './reset-password.html',

  styleUrl: './reset-password.scss',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPassword {


  readonly dialog = inject(MatDialog);

  readonly authService = inject(Auth);


  errorMessage = '';

  successMessage = '';

  isChecking = false;


  PasswordForm = new FormGroup({

    UserName: new FormControl('', [
      Validators.required
    ]),

    Email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    Phon: new FormControl('', [
      Validators.required
    ])

  });


  // =================================
  // בדיקת הפרטים
  // =================================

  verifyUser(): void {

    if (this.PasswordForm.invalid) {

      this.PasswordForm.markAllAsTouched();

      return;

    }


    this.errorMessage = '';

    this.successMessage = '';

    this.isChecking = true;


    const data = {

      UserName:
        this.PasswordForm.value.UserName ?? '',

      Email:
        this.PasswordForm.value.Email ?? '',

      Phon:
        this.PasswordForm.value.Phon ?? ''

    };


    this.authService
      .verifyResetDetails(data)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ המשתמש אומת:',
            response
          );

          this.isChecking = false;

          this.openNewPasswordDialog();

        },


        error: (error) => {

          console.error(
            '❌ שגיאה באימות:',
            error
          );

          this.isChecking = false;

          this.errorMessage =
            error.error?.message ??
            'הפרטים שהוזנו אינם תואמים למשתמש במערכת';

        }

      });

  }


  // =================================
  // פתיחת חלונית סיסמה חדשה
  // =================================

  openNewPasswordDialog(): void {

    const dialogRef =
      this.dialog.open(NewPassword, {

        width: '460px',

        maxWidth:
          'calc(100vw - 30px)',

        panelClass:
          'new-password-panel'

      });


    dialogRef
      .afterClosed()
      .subscribe((password) => {

        if (!password) {
          return;
        }


        this.updatePassword(password);

      });

  }


  // =================================
  // עדכון הסיסמה
  // =================================

  updatePassword(password: string): void {

    const data = {

      UserName:
        this.PasswordForm.value.UserName ?? '',

      Password:
        password

    };


    this.authService
      .resetPassword(data)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ הסיסמה עודכנה:',
            response
          );

          this.successMessage =
            'הסיסמה עודכנה בהצלחה!';

          this.errorMessage = '';

        },


        error: (error) => {

          console.error(
            '❌ שגיאה בעדכון הסיסמה:',
            error
          );

          this.errorMessage =
            error.error?.message ??
            'אירעה שגיאה בעדכון הסיסמה';

        }

      });

  }

}