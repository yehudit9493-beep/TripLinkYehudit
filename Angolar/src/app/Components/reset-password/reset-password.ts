import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewPassword } from '../new-password/new-password';
import { RouterModule } from '@angular/router';

export interface DialogData {
  animal: string;
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class ResetPassword {

  PasswordForm = new FormGroup({
    UserName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Phon: new FormControl('', [Validators.required]),

  })

  readonly animal = signal('');
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(NewPassword, {
      data: { animal: this.animal() },
      width: '460px',
      maxWidth: 'calc(100vw - 30px)',
      panelClass: 'new-password-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }

}
