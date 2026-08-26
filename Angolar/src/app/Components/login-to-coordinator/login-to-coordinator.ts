import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-to-coordinator',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-to-coordinator.html',
  styleUrl: './login-to-coordinator.scss',
})
export class LoginToCoordinator {

  CoordinatorForm = new FormGroup({
    FirsName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    Title: new FormControl('', [Validators.required]),
    Phon: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    InstitutionName: new FormControl('', [Validators.required]),
    InstitutionCity: new FormControl('', [Validators.required]),
    InstitutionPhon: new FormControl('', [Validators.required]),
    PrincipalName: new FormControl('', [Validators.required]),
    InstitutionType: new FormControl('', [Validators.required]),
    AgeGroup: new FormControl('', [Validators.required]),
    Gender: new FormControl('', [Validators.required]),





  })
}
