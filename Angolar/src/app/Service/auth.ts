
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 
import { User } from '../Interfacess/user';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiURL = "https://localhost:7216/api";

  constructor(
    private router: Router,
    private http: HttpClient 
  ) { }

  login(userName: string, password: string): Observable<User> {
    const loginData = { userName: userName, password: password };

    return this.http.post<User>(`${this.apiURL}/Login/login`, loginData).pipe(
      // tap((user: User) => {
      //   // אם השרת החזיר משתמש בהצלחה, נשמור אותו ב-localStorage
      //   if (user) {
      //     localStorage.setItem('currentUser', JSON.stringify(user));
      //     localStorage.setItem('isLoggedIn', 'true');
      //   }
      // })

      tap((user: User) => {
      console.log('✅ תשובה מהשרת:', user);
      
      // ✅ בדוק שיש userId (עכשיו זה יעבוד!)
      if (user && user.userId) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        throw new Error('Invalid user response from server');
      }
    }),
    catchError((error) => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      return throwError(() => error);
    })
    
  );
}

  isUserAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUser(): User | null {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/entry']);
  }

  // הבאת כל המשתמשים מהשרת בבקשת GET
  GetUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURL}/Users`); // שנה את ה-URL לפי הנתיב המדויק ב-C#
  }

  //  קבל את שם המשתמש
  getCurrentUserName(): string {
    const user = this.getCurrentUser() as any;
    if (!user) return 'משתמש';

    // בודק אם הגיע firstName מהשרת או FirstName מהמוק
    return user.firstName || user.FirstName || 'משתמש';
  }
  //  קבל את ID המשתמש
  getCurrentUserId(): number {
    const user = this.getCurrentUser();
    return user?.userId || 1;
  }

  //  קבל את אימייל המשתמש
  getCurrentUserEmail(): string {
    const user = this.getCurrentUser();
    return user ? user.Email : '';
  }

  getCurrentUserPermission(): number {
    const user = this.getCurrentUser();
    return user?.PermissionId ?? 0;
  }
}