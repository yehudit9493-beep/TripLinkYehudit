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


  // =====================================================
  // אנימציה
  // =====================================================

  isForumMessageChanging: boolean = false;

  private changeTimeout: ReturnType<typeof setTimeout> | null = null;


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

    // רקע של דף הבית
    document.body.classList.add('home-bg');

    // טעינת הודעות
    this.loadForumMessages();
  }


  // =====================================================
  // טעינת הודעות הפורום
  // =====================================================

  private loadForumMessages(): void {

    let messages =
      this.forums.getMessagesByForumId(1);


    // העתקה כדי לא לשנות
    // את המערך המקורי של הסרביס
    messages = [...messages];


    // הודעות חדשות קודם
    messages.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );


    // מקסימום 5 הודעות
    this.forumMessages =
      messages.slice(0, 5);


    // מתחילים מההודעה הראשונה
    this.currentForumMessageIndex = 0;


    // אם יש יותר מהודעה אחת
    // מתחילים החלפה אוטומטית
    if (this.forumMessages.length > 1) {

      this.startForumRotation();
    }
  }


  // =====================================================
  // החלפה אוטומטית
  // =====================================================

  private startForumRotation(): void {

    this.stopForumRotation();


    this.forumInterval = setInterval(() => {

      this.changeToNextForumMessage();

    }, 5000);
  }


  // =====================================================
  // מעבר להודעה הבאה
  // =====================================================

  private changeToNextForumMessage(): void {

    if (this.forumMessages.length <= 1) {

      return;
    }


    // מונע הפעלה כפולה
    if (this.isForumMessageChanging) {

      return;
    }


    /*
      שלב 1:
      מפעילים את אנימציית היציאה.

      ההודעה הנוכחית תצא שמאלה.
    */

    this.isForumMessageChanging = true;

    this.cdr.detectChanges();


    /*
      שלב 2:
      מחכים שהאנימציה תסתיים.
      
      700ms = אורך האנימציה ב-CSS.
    */

    this.changeTimeout = setTimeout(() => {


      /*
        עוברים להודעה הבאה
      */

      this.currentForumMessageIndex =
        (
          this.currentForumMessageIndex + 1
        ) % this.forumMessages.length;


      /*
        מחזירים את המצב ל-false.

        Angular יציג עכשיו את ההודעה החדשה,
        והיא תיכנס מימין.
      */

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


    if (this.changeTimeout !== null) {

      clearTimeout(this.changeTimeout);

      this.changeTimeout = null;
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
      index >= this.forumMessages.length
    ) {

      return;
    }


    if (index === this.currentForumMessageIndex) {

      return;
    }


    // אם כבר מתבצעת אנימציה
    if (this.isForumMessageChanging) {

      return;
    }


    /*
      הפעלה של אנימציית יציאה
    */

    this.isForumMessageChanging = true;

    this.cdr.detectChanges();


    /*
      אחרי שההודעה הישנה יצאה
      מציגים את ההודעה שבחר המשתמש.
    */

    this.changeTimeout = setTimeout(() => {

      this.currentForumMessageIndex = index;

      this.isForumMessageChanging = false;

      this.cdr.detectChanges();


      /*
        מתחילים מחדש את 5 השניות
      */

      this.startForumRotation();

    }, 700);
  }


  // =====================================================
  // כניסה / הרשמה
  // =====================================================

  openLoginOptions(): void {

    this.dialog.open(Login, {

      width: '450px',
      maxWidth: '92vw',

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