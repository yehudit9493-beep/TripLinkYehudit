import { CommonModule, Time } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../Service/auth';
import { User } from '../../Interfacess/user';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesPanel } from '../favorites-panel/favorites-panel';
import { FavoriteService } from '../../Service/favorite-service';
import { GetDate } from '../../Service/get-date';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, MatIconModule, FavoritesPanel],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true
})
export class Header {

  message: string = '';

  hebrewDate: string = '';

  showFavorites: boolean = false;

  loggedInUser: User | null = null;

  constructor(private authService: Auth,
    private favoritesService: FavoriteService,
    private getDate: GetDate,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const savedData = localStorage.getItem('currentUser');
    if (savedData) {
      this.loggedInUser = JSON.parse(savedData) as User;
    }
    this.message = this.Hours()


    this.getDate.GetDateHebrew().subscribe(
      data => {
        this.hebrewDate = data.hebrew;
        this.cdr.detectChanges();
      });
  }

  Hours(): string {
    const currentHour: number = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12)
      return 'בוקר טוב'
    else if (currentHour >= 12 && currentHour < 17)
      return 'צהרים טובים'
    else if (currentHour >= 17 && currentHour < 21)
      return 'ערב טוב'
    else
      return 'לילה טוב'

  }

  get favoritesCount(): number {
    return this.favoritesService.getFavorites().length;
  }

  toggleFavorites() {
    this.showFavorites = !this.showFavorites;
  }

}
