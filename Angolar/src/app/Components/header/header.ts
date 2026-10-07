import { CommonModule, Time } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../Service/auth';
import { User } from '../../Interfacess/user';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesPanel } from '../favorites-panel/favorites-panel';
import { FavoriteService } from '../../Service/favorite-service';
import { GetDate } from '../../Service/get-date';
import { UserAdminService } from '../../Service/user-admin.service';

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

  isLoggingOut = false;

  isAdmin: boolean = false;



  constructor(private authService: Auth,
    private favoritesService: FavoriteService,
    private getDate: GetDate,
    private userAdminService: UserAdminService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const savedData = localStorage.getItem('currentUser');
    if (savedData) {
      this.loggedInUser = JSON.parse(savedData) as User;
    }
    this.isAdmin = this.hasPermission(1) || this.hasPermission(2);
    this.message = this.Hours()


    this.getDate.GetDateHebrew().subscribe(
      data => {
        this.hebrewDate = data.hebrew;
        this.cdr.detectChanges();
      });
  }

  hasPermission(permissionId: number): boolean {
    return !!this.loggedInUser && (this.loggedInUser.permissionIds ?? []).includes(permissionId);
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

  // התנתקות: ניקוי ה-localStorage, ניקוי המועדפים וחזרה לדף הראשי
  logout() {
    this.isLoggingOut = true;
    this.authService.logout();
    this.favoritesService.getFavorites().length = 0;
    this.loggedInUser = null;
    this.router.navigate(['/']);
    this.isLoggingOut = false;
  }

  // הפנייה לעריכת הפרופיל לפי סוג המשתמש (רכזת / מדריכה)
  goToEditProfile() {
    const userId = this.authService.getCurrentUserId();

    // בדיקת הסוג מול השרת לפי ה-UserId של המשתמש המחובר
    this.userAdminService.getProfileType(userId).subscribe({
      next: (res) => {
        if (res.profileType === 'guide') {
          this.router.navigate(['/login-to-guide']);
        } else {
          // רכזת (או ברירת מחדל) - עם פרמטר edit למצב עריכה
          this.router.navigate(['/login-to-coordinator'], {
            queryParams: { mode: 'edit' },
          });
        }
      },
      error: () => {
        // במקרה של שגיאה נחזור להתנהגות הקודמת: קומפוננטת הרכזת
        this.router.navigate(['/login-to-coordinator'], {
          queryParams: { mode: 'edit' },
        });
      },
    });
  }

 
}
