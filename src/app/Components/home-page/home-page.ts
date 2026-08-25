import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../Service/auth';
import { User } from '../../Interfacess/user';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: true
})
// export class HomePage {

// }
export class HomePage implements OnInit {

  // loggedInUser: User | null = null;

  loggedInUser = signal<User | null>(null);

  private authService = inject(Auth);
  private router = inject(Router);

  ngOnInit() {
    // שליפת הטקסט מה-localStorage והפיכתו חזרה לאובייקט
    const savedData = localStorage.getItem('currentUser');
    if (savedData) {
      this.loggedInUser.set(JSON.parse(savedData) as User);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  cards = [
    {
      title: 'מסלולים',
      subtitle: 'גלו את המסלולים המומלצים',
      content: 'תיאור כללי על המסלולים המומלצים לטיולים.',
      action: 'למידע נוסף',
      route: '/trails'
    },
    {
      title: 'אטרקציות',
      subtitle: 'אטרקציות לא לפספס',
      content: 'כל האטרקציות המרתקות שיכולים להביא לכם חוויה בלתי נשכחת.',
      action: 'ראה פרטים',
      route: '/attractions'
    },
    {
      title: 'מקומות לינה',
      subtitle: 'לינה נוחה ובמחיר משתלם',
      content: 'מצא את מקומות הלינה הכי נוחים ליד האטרקציות.',
      action: 'חפש מקום',
      route: '/hotels'
    },
    {
      title: 'מדריכות',
      subtitle: 'מדריכות טיולים מנוסות ומקצועיות',
      content: 'מצא מדריכת טיולים מתאימה בשבילך',
      action: 'תאם מדריכה',
      route: '/guide'
    }
  ];

}
