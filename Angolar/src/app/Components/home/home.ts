// import {
//   ChangeDetectorRef,
//   Component,
//   OnDestroy,
//   OnInit
// } from '@angular/core';

// import { DatePipe } from '@angular/common';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { RouterModule } from '@angular/router';

// import { Login } from '../login/login';
// import { Forums } from '../../Service/forums';
// import { Message } from '../../Interfacess/message';


// @Component({
//   selector: 'app-home',

//   imports: [
//     RouterModule,
//     MatDialogModule,
//     DatePipe
//   ],

//   templateUrl: './home.html',

//   styleUrl: './home.scss',

//   standalone: true
// })


// export class Home implements OnInit, OnDestroy {


//   // =====================================================
//   // הודעות פורום
//   // =====================================================

//   forumMessages: Message[] = [];

//   currentForumMessageIndex: number = 0;

//   isForumMessageChanging: boolean = false;


//   // =====================================================
//   // Timer
//   // =====================================================

//   private forumInterval: ReturnType<typeof setInterval> | null = null;


//   // =====================================================
//   // Constructor
//   // =====================================================

//   constructor(
//     private dialog: MatDialog,
//     private forums: Forums,
//     private cdr: ChangeDetectorRef
//   ) { }


//   // =====================================================
//   // אתחול
//   // =====================================================

//   ngOnInit(): void {

//     // רקע של דף הבית
//     document.body.classList.add('home-bg');

//     // טעינת הודעות
//     this.loadForumMessages();
//   }


//   // =====================================================
//   // טעינת הודעות הפורום
//   // =====================================================

//   private loadForumMessages(): void {

//     this.forums.getMessagesByForumId(1).subscribe(messages => {

//       // הודעות חדשות קודם
//       messages.sort(
//         (a, b) =>
//           new Date(b.date).getTime() -
//           new Date(a.date).getTime()
//       );

//       // מקסימום 5 הודעות
//       this.forumMessages = messages.slice(0, 5);

//       // מתחילים מההודעה הראשונה
//       this.currentForumMessageIndex = 0;

//       // אם יש יותר מהודעה אחת,
//       // מתחילים החלפה אוטומטית
//       if (this.forumMessages.length > 1) {
//         this.startForumRotation();
//       }
//     });
//   }


//   // =====================================================
//   // החלפה אוטומטית
//   // =====================================================

//   private startForumRotation(): void {

//     this.stopForumRotation();


//     this.forumInterval = setInterval(() => {

//       this.currentForumMessageIndex =
//         (
//           this.currentForumMessageIndex + 1
//         ) % this.forumMessages.length;


//       // גורם ל-Angular לעדכן את המסך
//       this.cdr.detectChanges();

//     }, 5000);
//   }


//   // =====================================================
//   // עצירת Timer
//   // =====================================================

//   private stopForumRotation(): void {

//     if (this.forumInterval !== null) {

//       clearInterval(this.forumInterval);

//       this.forumInterval = null;
//     }
//   }


//   // =====================================================
//   // ההודעה הנוכחית
//   // =====================================================

//   get currentForumMessage(): Message | null {

//     if (this.forumMessages.length === 0) {

//       return null;
//     }


//     return this.forumMessages[
//       this.currentForumMessageIndex
//     ];
//   }


//   // =====================================================
//   // מעבר ידני
//   // =====================================================

//   goToForumMessage(index: number): void {

//     if (
//       index < 0 ||
//       index >= this.forumMessages.length
//     ) {

//       return;
//     }


//     this.currentForumMessageIndex = index;


//     // מאפסים את ההחלפה
//     // כדי שהמשתמש יקבל 5 שניות
//     // מההודעה שבחר
//     this.startForumRotation();
//   }


//   // =====================================================
//   // כניסה / הרשמה
//   // =====================================================

//   openLoginOptions(): void {

//     this.dialog.open(Login, {

//       width: '450px',

//       panelClass: 'custom-modalbox'

//     });
//   }


//   // =====================================================
//   // ניקוי
//   // =====================================================

//   ngOnDestroy(): void {

//     document.body.classList.remove('home-bg');

//     this.stopForumRotation();
//   }

// }


import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { Login } from '../login/login';
import { Forums } from '../../Service/forums';
import { Message } from '../../Interfacess/message';


@Component({
  selector: 'app-home',

  imports: [
    RouterModule,
    MatDialogModule,
    DatePipe
  ],

  templateUrl: './home.html',

  styleUrl: './home.scss',

  standalone: true
})


export class Home implements OnInit, OnDestroy {


  // =====================================================
  // הודעות פורום
  // =====================================================

  forumMessages: Message[] = [];

  currentForumMessageIndex: number = 0;

  isForumMessageChanging: boolean = false;


  // =====================================================
  // Timer
  // =====================================================

  private forumInterval: ReturnType<typeof setInterval> | null = null;


  // =====================================================
  // Constructor
  // =====================================================

  constructor(
    private dialog: MatDialog,
    private forums: Forums,
    private cdr: ChangeDetectorRef
  ) { }


  // =====================================================
  // אתחול
  // =====================================================

  ngOnInit(): void {

    document.body.classList.add('home-bg');

    this.loadForumMessages();
  }


  // =====================================================
  // טעינת הודעות הפורום
  // =====================================================

  private loadForumMessages(): void {

    this.forums.getMessagesByForumId(1).subscribe(messages => {

      // יוצרים עותק כדי לא לשנות את המערך המקורי
      const sortedMessages = [...messages];

      // הודעות חדשות קודם
      sortedMessages.sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      );

      // מקסימום 5 הודעות
      this.forumMessages = sortedMessages.slice(0, 5);

      // מתחילים מההודעה הראשונה
      this.currentForumMessageIndex = 0;

      // מאפסים אנימציה
      this.isForumMessageChanging = false;

      // מתחילים החלפה אוטומטית
      if (this.forumMessages.length > 1) {

        this.startForumRotation();
      }
    });
  }


  // =====================================================
  // החלפה אוטומטית
  // =====================================================

  private startForumRotation(): void {

    this.stopForumRotation();

    this.forumInterval = setInterval(() => {

      this.changeForumMessage();

    }, 5000);
  }


  // =====================================================
  // החלפת הודעה + אנימציה
  // =====================================================

  private changeForumMessage(): void {

    if (this.forumMessages.length <= 1) {
      return;
    }

    // מפעילים את אנימציית היציאה
    this.isForumMessageChanging = true;

    this.cdr.detectChanges();


    // מחכים לסיום אנימציית היציאה
    setTimeout(() => {

      // עוברים להודעה הבאה
      this.currentForumMessageIndex =
        (this.currentForumMessageIndex + 1)
        % this.forumMessages.length;


      // מבטלים את slide-out
      this.isForumMessageChanging = false;

      this.cdr.detectChanges();

    }, 700);
  }


  // =====================================================
  // עצירת Timer
  // =====================================================

  private stopForumRotation(): void {

    if (this.forumInterval !== null) {

      clearInterval(this.forumInterval);

      this.forumInterval = null;
    }
  }


  // =====================================================
  // ההודעה הנוכחית
  // =====================================================

  get currentForumMessage(): Message | null {

    if (this.forumMessages.length === 0) {
      return null;
    }

    return this.forumMessages[
      this.currentForumMessageIndex
    ];
  }


  // =====================================================
  // מעבר ידני
  // =====================================================

  goToForumMessage(index: number): void {

    if (
      index < 0 ||
      index >= this.forumMessages.length ||
      index === this.currentForumMessageIndex
    ) {
      return;
    }

    // עוצרים את הטיימר בזמן המעבר
    this.stopForumRotation();

    // מפעילים אנימציית יציאה
    this.isForumMessageChanging = true;

    this.cdr.detectChanges();


    setTimeout(() => {

      this.currentForumMessageIndex = index;

      this.isForumMessageChanging = false;

      this.cdr.detectChanges();

      // מתחילים מחדש את ה־5 שניות
      this.startForumRotation();

    }, 700);
  }


  // =====================================================
  // כניסה / הרשמה
  // =====================================================

  openLoginOptions(): void {

    this.dialog.open(Login, {

      width: '450px',

      panelClass: 'custom-modalbox'

    });
  }


  // =====================================================
  // ניקוי
  // =====================================================

  ngOnDestroy(): void {

    document.body.classList.remove('home-bg');

    this.stopForumRotation();
  }

}