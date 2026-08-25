// import { NgClass } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink } from "@angular/router";
// import { User } from '../../Interfacess/user';
// import { Auth } from '../../Service/auth';

// @Component({
//   selector: 'app-entry',
//   imports: [ReactiveFormsModule, NgClass, RouterLink],
//   templateUrl: './entry.html',
//   styleUrl: './entry.scss',
//   standalone: true
// })

// export class Entry {

//   UserList: User[] = [];
//   errorMessage: string = '';

//   constructor(private authService: Auth, private router: Router){}

//   ngOnInit() : void{
//       this.authService.GetUser().subscribe({
//         next:(data)=>{
//           this.UserList = data;
//         }
//       })

//   }

//   UserForm = new FormGroup({
//     UserName: new FormControl('', [Validators.required, Validators.email]),
//     Password: new FormControl('', [
//       Validators.required,
//       Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])

//   })
//   isPasswordVisible: boolean = false;

//   togglePasswordVisibility() {
//     this.isPasswordVisible = !this.isPasswordVisible;
//   }

// onSubmit() {
//     if (this.UserForm.invalid) {
//       this.UserForm.markAllAsTouched();
//       return;
//     }

//     const emailInput = this.UserForm.value.UserName ?? '';
//     const passwordInput = this.UserForm.value.Password ?? '';

//     const isLoginSuccess = this.authService.login(emailInput, passwordInput);

//     if (isLoginSuccess) {
//       this.errorMessage = ''; 
//       this.router.navigate(['/home-page']); 
//     } else {
//       this.errorMessage = 'שם המשתמש או הסיסמה אינם נכונים. נסי שוב!';
//     }
//   }

// }




import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { User } from '../../Interfacess/user';
import { Auth } from '../../Service/auth';

@Component({
  selector: 'app-entry',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './entry.html',
  styleUrl: './entry.scss',
  standalone: true
})
export class Entry {

  UserList: User[] = [];
  errorMessage: string = '';
  isPasswordVisible: boolean = false;

  constructor(private authService: Auth, private router: Router){}

  ngOnInit() : void {
    this.authService.GetUser().subscribe({
      next: (data) => {
        this.UserList = data;
      }
    });
  }

  UserForm = new FormGroup({
    UserName: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ])
  });

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.UserForm.invalid) {
      this.UserForm.markAllAsTouched();
      return;
    }

    const emailInput = this.UserForm.value.UserName ?? '';
    const passwordInput = this.UserForm.value.Password ?? '';

    // שינוי כאן: קריאה לסרביס וביצוע Subscribe לקבלת התשובה מהשרת
    this.authService.login(emailInput, passwordInput).subscribe({
      next: (user) => {
        // אם הגענו לכאן, השרת החזיר סטטוס 200 (הצלחה) והמשתמש קיים
        this.errorMessage = ''; 
        this.router.navigate(['/home-page']); 
      },
      error: (err) => {
        // אם הגענו לכאן, השרת החזיר שגיאה (למשל סטטוס 401 Unauthorized או 400)
        console.error('Login error:', err);
        this.errorMessage = 'שם המשתמש או הסיסמה אינם נכונים. נסי שוב!';
      }
    });
  }
}