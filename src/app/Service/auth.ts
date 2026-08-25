// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { User } from '../Interfacess/user';
// import { Observable, of } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class Auth {

//   apiURL = "https://localhost:7216/api/Login/login"

//   private MockUser: User[] = [
//     {
//       userId: 1,
//       UserName: 'yehudit9493@gmail.com',
//       Password: 'Yehudit9493?',
//       FirstName: 'Yehudit',
//       LastName: 'Munk',
//       Adress: 'haritba 16',
//       Email: 'yehudit9493@gmail.com',
//       PhonNumber: '0504139493',
//       PermissionId: 1
//     }
//   ]

//   constructor(private router: Router) { }

//   login(userName: string, password: string) {

//     this.apiURL+'Login/login';
//     const user = this.MockUser.find(
//       u => u.UserName === userName && u.Password === password
//     );

//     if (user) {
//       localStorage.setItem('currentUser', JSON.stringify(user));
//       localStorage.setItem('isLoggedIn', 'true');
//       return true;
//     }
//     return false;
//   }

//   isUserAuthenticated(): boolean {
//     return localStorage.getItem('isLoggedIn') === 'true';
//   }

//   getCurrentUser(): User | null {
//     const saved = localStorage.getItem('currentUser');
//     return saved ? JSON.parse(saved) : null;
//   }

//   logout(): void {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('currentUser');
//     this.router.navigate(['/entry']);
//   }

//   GetUser(): Observable<User[]> {
//     return of(this.MockUser);
//   }

//   // ✅ הוסף - קבל את שם המשתמש
//   getCurrentUserName(): string {
//     const user = this.getCurrentUser();
//     return user ? user.FirstName : 'משתמש';
//   }

//   // ✅ הוסף - קבל את ID המשתמש
//   getCurrentUserId(): number {
//     const user = this.getCurrentUser();
//     return user?.userId || 1;
//   }

//   // ✅ הוסף - קבל את אימייל המשתמש
//   getCurrentUserEmail(): string {
//     const user = this.getCurrentUser();
//     return user ? user.Email : '';
//   }

//   getCurrentUserPermission(): number {
//     const user = this.getCurrentUser();
//     return user?.PermissionId ?? 0;
//   }

// }


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // 1. ייבוא ה-HttpClient
import { User } from '../Interfacess/user';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  // כתובת הבסיס של ה-API שלך (מומלץ לשים פה רק את כתובת השרת)
  private apiURL = "https://localhost:7216/api";

  constructor(
    private router: Router,
    private http: HttpClient // 2. הזרקת ה-HttpClient בבנאי
  ) { }

  // פונקציית ההתחברות מעודכנת לקריאת POST אמיתית לשרת
  login(userName: string, password: string): Observable<User> {
    const loginData = { userName: userName, password: password };

    // שליחת בקשת POST לשרת ה-C#
    return this.http.post<User>(`${this.apiURL}/Login/login`, loginData).pipe(
      tap((user: User) => {
        // אם השרת החזיר משתמש בהצלחה, נשמור אותו ב-localStorage
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');
        }
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

  // ✅ קבל את שם המשתמש
  getCurrentUserName(): string {
    const user = this.getCurrentUser() as any;
    if (!user) return 'משתמש';

    // בודק אם הגיע firstName מהשרת או FirstName מהמוק
    return user.firstName || user.FirstName || 'משתמש';
  }
  // ✅ קבל את ID המשתמש
  getCurrentUserId(): number {
    const user = this.getCurrentUser();
    return user?.userId || 1;
  }

  // ✅ קבל את אימייל המשתמש
  getCurrentUserEmail(): string {
    const user = this.getCurrentUser();
    return user ? user.Email : '';
  }

  getCurrentUserPermission(): number {
    const user = this.getCurrentUser();
    return user?.PermissionId ?? 0;
  }
}