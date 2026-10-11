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

    this.authService.login(emailInput, passwordInput).subscribe({
      next: (user) => {
      
        this.errorMessage = ''; 
        this.router.navigate(['/home-page']); 
      },
      error: (err) => {
        
        console.error('Login error:', err);
        this.errorMessage = 'שם המשתמש או הסיסמה אינם נכונים. נסי שוב!';
      }
    });
  }
}