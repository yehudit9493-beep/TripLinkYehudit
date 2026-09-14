// import { Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';

// import {
//   MatDialogActions,
//   MatDialogClose,
//   MatDialogContent,
//   MatDialogRef
// } from '@angular/material/dialog';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

// @Component({
//   selector: 'app-new-password',

//   standalone: true,

//   imports: [
//     MatFormFieldModule,
//     MatInputModule,
//     FormsModule,
//     MatButtonModule,
//     MatDialogClose
//   ],

//   templateUrl: './new-password.html',
//   styleUrl: './new-password.scss',
// })
// export class NewPassword {

//   readonly dialogRef =
//     inject(MatDialogRef<NewPassword>);

//   password = '';

//   confirmPassword = '';

//   showPassword = false;

//   showConfirmPassword = false;


//   passwordPattern =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


//   onNoClick(): void {

//     this.dialogRef.close();

//   }


//   get isPasswordValid(): boolean {

//     return this.passwordPattern.test(
//       this.password
//     );

//   }


//   get passwordsMatch(): boolean {

//     return (
//       this.password ===
//       this.confirmPassword
//     );

//   }


//   get canSave(): boolean {

//     return (
//       this.isPasswordValid &&
//       this.passwordsMatch
//     );

//   }

// }



import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogClose,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose
  ],
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss'
})
export class NewPassword {

  readonly dialogRef = inject(MatDialogRef<NewPassword>);

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  onNoClick(): void {
    this.dialogRef.close();
  }

  get isPasswordValid(): boolean {
    return this.passwordPattern.test(this.password);
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get canSave(): boolean {
    return this.isPasswordValid && this.passwordsMatch;
  }
}