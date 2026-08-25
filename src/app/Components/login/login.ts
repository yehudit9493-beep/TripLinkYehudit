import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatDialogModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone : true,
})
export class Login {

constructor(
    private dialogRef: MatDialogRef<RegistrationOptions>,
    private router: Router
  ) {}

  navigate(role: string) {
    this.dialogRef.close(); // סוגר את החלונית
    
    // ניתוב לפי התפקיד שנבחר
    setTimeout(() => {
    if (role === 'loginToGuide') this.router.navigate(['/login-to-guide']);
    else if (role === 'loginToCoordinator') this.router.navigate(['/login-to-coordinator']);
    else if (role === 'logintoAll') this.router.navigate(['/login-to-all']);
    })
  }

  goBack() {
  this.dialogRef.close();
  this.router.navigate(['/']);
}

}
