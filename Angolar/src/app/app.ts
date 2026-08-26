import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from './Components/header/header';
import { Auth } from './Service/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone : true
})
export class App {
  protected readonly title = signal('Progect');

  constructor(private authService: Auth) {}

  isLoggedIn(): boolean {
    return this.authService.isUserAuthenticated();
  }
}
