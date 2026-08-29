import { Injectable } from '@angular/core';
import { Message, Reply } from '../Interfacess/message';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Forums {

    private readonly API_URL = 'https://localhost:7216/api';

  constructor(private httpClient: HttpClient ) { }

  readonly forumConfig: Record<number, {
    title: string;
    subtitle: string;
    canPost: number[];   // PermissionId שיכולים לפרסם
    canReply: number[];  // PermissionId שיכולים לענות
    sortDesc: boolean;
  }> = {
      1: {
        title: '💬 חוויות והמלצות',
        subtitle: 'שתפו חוויות, המלצות ורשמים מהטיולים שלכם',
        canPost: [1, 2],    // כולם
        canReply: [1, 2],   // כולם
        sortDesc: false     // מהישן לחדש
      },
      2: {
        title: '❓ שאלות ותשובות',
        subtitle: 'שאלות שחוזרות על עצמן',
        canPost: [1, 2],    // כולם יכולים לשאול
        canReply: [2],      // רק מדריכות עם הרשאה
        sortDesc: false
      },
      3: {
        title: '⚠️ פורום בטיחות',
        subtitle: 'שאלות ומידע בנושאי בטיחות',
        canPost: [1, 2],
        canReply: [3],      // הרשאה נפרדת לבטיחות
        sortDesc: true      // מהחדש לישן
      }
    };

  /**
   * Get all messages for a given forum type from the server.
   * Returns an Observable because it's an HTTP call.
   */
  // getMessagesByForumId(forumId: number): Observable<Message[]> {
  //       console.log(' הגיע לפונקציה הזו')

  //   return this.httpClient.get<any[]>(`${this.API_URL}/Forum/${forumId}`).pipe(
  //     map(list => list.map(item => this.mapToMessage(item)))

  //   );
    
  // }



getMessagesByForumId(forumId: number): Observable<Message[]> {
    console.log('🔵 הגיע לפונקציה הזו עם forumId:', forumId);

    return this.httpClient.get<any[]>(`${this.API_URL}/forum/${forumId}`).pipe(
      
      // שלב 1: ראה את הגולמי מהשרת
      tap(rawData => {
        console.log('🟢 נתונים גולמיים מהשרת:');
        console.log(rawData);
        console.log('מספר הפריטים:', rawData?.length);
      }),
      
      // שלב 2: ממיר לאובייקטים
      map(list => list.map(item => this.mapToMessage(item))),
      
      // שלב 3: ראה אחרי המיפוי
      tap(mappedData => {
        console.log('🟡 נתונים לאחר מיפוי:');
        console.log(mappedData);
      })
    );
}




  /**
   * Add a new message (post) to the server.
   */
  addMessage(msg: { userId: number; forumTypeId: number; title: string; content: string }): Observable<Message> {
    return this.httpClient.post<any>(`${this.API_URL}/forum/messages`, msg).pipe(
      map(item => this.mapToMessage(item))
    );
  }

  /**
   * Add a reply to an existing message.
   */
  addReply(messageId: number, reply: { userId: number; forumTypeId: number; title: string; content: string }): Observable<Message> {
    return this.httpClient.post<any>(`${this.API_URL}/Forum/${messageId}/reply`, reply).pipe(
      map(item => this.mapToMessage(item))
    );
  }

  /**
   * Toggle like on a message. Returns true if liked, false if unliked.
   */
  toggleLike(messageId: number, userId: number): Observable<boolean> {
    return this.httpClient.post<{ liked: boolean }>(`${this.API_URL}/Forum/${messageId}/like`, { userId }).pipe(
      map(res => res.liked)
    );
  }

  // --------------------------------------------------------------------------
  // מיפוי מהשרת לאנגולר
  // --------------------------------------------------------------------------

 private mapToMessage(server: any): Message {
    return {
        idMessage: server.messageId,
        idForum: server.forumTypeId,
        userId: server.userId,
        userName: server.userFullName,        
        title: server.title,
        content: server.content,
        date: new Date(server.messageDate),
        replies: server.replies?.map((r: any) => this.mapToReply(r)) ?? [],
        likes: server.likeCount ?? 0
    };
}

private mapToReply(server: any): Reply {
    return {
        idMessage: server.messageId,
        idForum: server.forumTypeId,
        userId: server.userId,
        userName: server.userFullName,     
        content: server.content,
        date: new Date(server.messageDate),
        replies: server.replies?.map((r: any) => this.mapToReply(r)) ?? []
    };
}
}
