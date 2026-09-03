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


getMessagesByForumId(forumId: number): Observable<Message[]> {

    return this.httpClient.get<any[]>(`${this.API_URL}/forum/${forumId}`).pipe(
      
      // שלב 1: ראה את הגולמי מהשרת
      tap(rawData => {
       
      }),
      
      // שלב 2: ממיר לאובייקטים
      map(list => list.map(item => this.mapToMessage(item))),
      
      // שלב 3: ראה אחרי המיפוי
      tap(mappedData => {
       
      })
    );
}




  
  addMessage(msg: { userId: number; forumTypeId: number; title: string; content: string;  routeId?: number; 
  attractionId?: number;
  lodgingId?: number;
  guideUserId?: number; }): Observable<Message> {
    return this.httpClient.post<any>(`${this.API_URL}/forum/messages`, msg).pipe(
      map(item => this.mapToMessage(item))
    );
  }

 
  addReply(messageId: number, reply: { userId: number; forumTypeId: number; title: string; content: string }): Observable<Message> {
    return this.httpClient.post<any>(`${this.API_URL}/forum/${messageId}/reply`, reply).pipe(
      map(item => this.mapToMessage(item))
    );
  }

  
  toggleLike(messageId: number, userId: number): Observable<boolean> {
    return this.httpClient.post<{ liked: boolean }>(`${this.API_URL}/forum/${messageId}/like`, { userId }).pipe(
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
