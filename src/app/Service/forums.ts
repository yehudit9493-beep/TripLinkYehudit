import { Injectable } from '@angular/core';
import { Message, Reply } from '../Interfacess/message';

@Injectable({
  providedIn: 'root',
})
export class Forums {

  private messages: Message[] = [
    {
     idMessage: 1,
      idForum: 1,
      userId: 1,
      userName: 'yehudit',
      title: ' נחל קיבוצים',
      content: "אני הייתי עם בית הספר שלי בנחל קיבוצים, היה נהדר! הבנות נהנו מאוד מהטיפול והנופים היו מדהימים. ממלצת מאוד לכל קבוצה שרוצה חוויה טבעית.",
      date: new Date('2024-01-03'),
      relatedLinks: [],
      replies: [{
        idMessage: 101,
        idForum: 1,
        userId: 2,
        userName: "יוכבד לוי",
        content: "כן גם אנחנו מאוד נהננו! זה נחל מאוד מוצלח. הילדות שלי עדיין מספרות על זה. בקיץ הבא נחזור!",
        date: new Date('2024-01-04'),
        relatedLinks: [],
        replies: []
      },
      {
        idMessage: 102,
        idForum: 1,
        userId: 3,
        userName: "רחל כהן",
        content: "תודה על ההמלצה! בדקנו את המסלול וממש הולכים לשם בחודש הבא עם הקבוצה שלנו.",
        date: new Date('2024-01-05'),
        relatedLinks: [],
        replies: []
      }]
    },
    {
      idMessage: 2,
      idForum: 1,
      userId: 2,
      userName: "chani",
      title: ' מדריכה מומלצת - מיכל כהן',
      content: "רציתי להמליץ מאוד על המדריכה מיכל כהן. יש לה גישה מעולה לילדות, היא סבלנית ומקצועית. הקבוצה שלנו התחברה אליה במהירות ובחרנו לקחת אותה שוב.",
      date: new Date('2024-01-15'),
      relatedLinks: [],
      replies: []
    },
    {
      idMessage: 3,
      idForum: 1,
      userId: 4,
      userName: "שמונה גדול",
      title: ' טיול שדות פרחים - ביישן',
      content: "טיול מדהים בשדות הפרחים של ביישן! הנופים היו מדהימים והתמונות שלנו יצאו פנטסטיות. המסלול מתאים גם לילדים קטנים. ממלצת בחום!",
      date: new Date('2024-02-10'),
      relatedLinks: [],
      replies: [{
        idMessage: 103,
        idForum: 1,
        userId: 1,
        userName: "אברהם",
        content: "תודה על ההמלצה! כמה זמן לקח לכם להליכה? האם יש דרישות כושר מיוחדות?",
        date: new Date('2024-02-11'),
        relatedLinks: [],
        replies: []
      }]
    },
     {
      idMessage: 10,
      idForum: 2,
      userId: 1,
      userName: "shahar",
      title: '❓ כמה זמן מראש צריך להזמין טיול?',
      content: "שלום, אני רוצה להזמין טיול לקבוצה שלי אבל לא בטוח כמה זמן צריך להזמין מראש. יש לכם הנחיות?",
      date: new Date('2024-01-20'),
      relatedLinks: [],
      replies: [{
        idMessage: 201,
        idForum: 2,
        userId: 5,
        userName: "רונה מדריכה",
        content: "שלום! מומלץ להזמין לפחות 2-3 שבועות מראש. אם זה טיול בעונת הקיץ, כדאי להזמין חודש לפחות. תלוי גם באתר - חלק מהאתרים דורשים הזמנה מוקדמת יותר.",
        date: new Date('2024-01-21'),
        relatedLinks: [],
        replies: []
      }]
    },
    {
      idMessage: 11,
      idForum: 2,
      userId: 2,
      userName: "דבורה",
      title: '❓ האם מותר לילדים לקחת צילום?',
      content: "האם זה בסדר שהילדות יקחו צילומים במהלך הטיול? יש איזה שהוא מדיניות בנושא?",
      date: new Date('2024-01-25'),
      relatedLinks: [],
      replies: [{
        idMessage: 202,
        idForum: 2,
        userId: 5,
        userName: "רונה מדריכה",
        content: "כן, מותר ומומלץ! רק צריך להזהיר את הילדות להיזהר עם הפונים במשטחים רטובים. אנחנו בדרך כלל אומרים שהטלפונים יוכנסו לשקיות עמידות במים.",
        date: new Date('2024-01-26'),
        relatedLinks: [],
        replies: []
      }]
    },
    {
      idMessage: 12,
      idForum: 2,
      userId: 3,
      userName: "מירה",
      title: '❓ מה לעשות אם ילד חולה ביום הטיול?',
      content: "בתי חולה או קופת חולים בסמוך? מה הפרוטוקול אם ילד מרגיש לא טוב בטיול?",
      date: new Date('2024-02-01'),
      relatedLinks: [],
      replies: [{
        idMessage: 203,
        idForum: 2,
        userId: 5,
        userName: "רונה מדריכה",
        content: "בכל טיול, המדריכה נושאת תיק עזרה ראשונה שלם עם תרופות בסיסיות. אם זה משהו חמור, אנחנו מוקדים לנקודת החירום הקרובה ביותר. כל המדריכים עברו הכשרה בהכנות ראשונות.",
        date: new Date('2024-02-02'),
        relatedLinks: [],
        replies: []
      }]
    },
    {
      idMessage: 13,
      idForum: 2,
      userId: 4,
      userName: 'אתי',
      title: '❓ האם יש טיולים לילדים קטנים?',
      content: "יש לי ילדות בגילאים 6-8, האם יש טיולים מתאימים לגיל זה?",
      date: new Date('2024-02-05'),
      relatedLinks: [],
      replies: [{
        idMessage: 204,
        idForum: 2,
        userId: 5,
        userName: "רונה מדריכה",
        content: 'בהחלט! יש לנו טיולים מיוחדים לגילאים 6-10. המסלולים קצרים יותר (עד 5 ק"מ) ובעלי דקויות נמוכה. אנחנו גם מספקים פעילויות חוץ-מוסדיות שמשעשעות.',
        date: new Date('2024-02-06'),
        relatedLinks: [],
        replies: []
      }]
    },

    {
      idMessage: 20,
      idForum: 3,
      userId: 2,
      userName: "יעל",
      title: '⚠️ מה עם בעלי חיים בטיול?',
      content: "האם אנחנו עלולים להיתקל בנחשים או עקרבים בטיול בנחל? מה כדאי לעשות?",
      date: new Date('2024-02-10'),
      relatedLinks: [],
      replies: [{
        idMessage: 301,
        idForum: 3,
        userId: 6,
        userName: "דן - מנהל בטיחות",
        content: "בעלי חיים בר יכולים להופיע, אבל זה נדיר. הנחשים בדרך כלל מתרחקים מאדם. עקרבים נמצאים בעיקר בערב. המלצה: לבוש מתאים (נעליים סגורות, מכנסיים), וציידו בפנס אם טיול בערב.",
        date: new Date('2024-02-11'),
        relatedLinks: [],
        replies: []
      }]
    },
    {
      idMessage: 21,
      idForum: 3,
      userId: 3,
      userName: "לאה",
      title: '⚠️ בטיחות בגשם - האם זה בטוח?',
      content: "תכננו טיול וחיזוי מזג האויר מציג סיכוי לגשם. האם זה בטוח להיות בטיול כשיורד גשם?",
      date: new Date('2024-02-12'),
      relatedLinks: [],
      replies: [{
        idMessage: 302,
        idForum: 3,
        userId: 6,
        userName: "דן - מנהל בטיחות",
        content: "גשם קל - בסדר. גשם כבד - אנחנו מבטלים או משנים את המסלול. סכנה גדולה: הצפות פתאומיות בנחלים. אנחנו עוקבים אחרי תחזוקה כל הזמן ויש לנו פרוטוקול פינוי מחירום.",
        date: new Date('2024-02-13'),
        relatedLinks: [],
        replies: [
          {
            idMessage: 303,
            idForum: 3,
            userId: 4,
            userName: "שמונה",
            content: "כמה זמן לפני הטיול אתם בודקים את התחזוקה?",
            date: new Date('2024-02-13'),
            relatedLinks: [],
            replies: []
          }
        ]
      }]
    },
    {
      idMessage: 22,
      idForum: 3,
      userId: 1,
      userName: "מיכל",
      title: '⚠️ ציוד בטיחות חובה בכל טיול',
      content: "רוצה לוודא - מה הציוד המינימלי הנדרש? תיק עזרה ראשונה, משקפי שמש, פנס?",
      date: new Date('2024-02-14'),
      relatedLinks: [],
      replies: [{
        idMessage: 304,
        idForum: 3,
        userId: 6,
        userName: "דן - מנהל בטיחות",
        content: "ציוד חובה למדריך: תיק עזרה ראשונה מלא, טלפון סלולרי, מפה ومצפן (או GPS), משקפי שמש, כובע. לילדות: משקפי שמש, כובע, בקבוק מים, נעליים סגורות. רצוי: פנס אם טיול בערב.",
        date: new Date('2024-02-15'),
        relatedLinks: [],
        replies: []
      }]
    },
    {
      idMessage: 23,
      idForum: 3,
      userId: 5,
      userName: "רונה מדריכה",
      title: '⚠️ הכשרות בטיחות - חובה או בחירה?',
      content: "האם כל מדריך חייב לעבור הכשרה בטיחות? מה בדיוק הן כוללות?",
      date: new Date('2024-02-16'),
      relatedLinks: [],
      replies: [{
        idMessage: 305,
        idForum: 3,
        userId: 6,
        userName: "דן - מנהל בטיחות",
        content: "חובה! כל מדריך עובר הכשרה שנתית: עזרה ראשונה בסיסית, טיפול בחירום, הכרת הסכנות בטבע, פרוטוקולי פינוי. בדיוק כמו צוות רפואי - הכשרה תמיד.",
        date: new Date('2024-02-17'),
        relatedLinks: [],
        replies: []
      },
      {
        idMessage: 306,
        idForum: 3,
        userId: 2,
        userName: "יעל",
        content: "בכמה זמן צריך לחדש את ההכשרה?",
        date: new Date('2024-02-17'),
        relatedLinks: [],
        replies: []
      }]
    },
    {
      idMessage: 24,
      idForum: 3,
      userId: 4,
      userName: "שמונה",
      title: '⚠️ ביטוח - האם זה כלול?',
      content: "יש ביטוח למקרה של תאונה בטיול? האם זה כולל את כל החברים?",
      date: new Date('2024-02-18'),
      relatedLinks: [],
      replies: [{
        idMessage: 307,
        idForum: 3,
        userId: 6,
        userName: "דן - מנהל בטיחות",
        content: "כן! כל טיול מכוסה בביטוח אחריות. המחיר כלול בעלות הטיול. כל משתתף (ילדות, מדריכות) מכוסה. בעת הרשמה אתם חתומים על הסכם.",
        date: new Date('2024-02-19'),
        relatedLinks: [],
        replies: []
      }]
    }

  ];

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

  private userLikes: Map<number, Set<number>> = new Map();

  getMessageById(id: number): Message | undefined {
    return this.messages.find(message => message.idMessage === id);
  }

  addMessage(msg: Message) {
    const newMessage: Message = {
      ...msg,
      idMessage: this.messages.length + 1,
      date: new Date(),
      replies: []
    };
    this.messages.push(newMessage);
  }

  getAllMessage(): Message[] {
    return this.messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  removeMessage(id: number): void {
    this.messages = this.messages.filter(message => message.idMessage !== id);
  }

  addReply(messageId: number, reply: Reply) {
    const message = this.messages.find(msg => msg.idMessage === messageId);
    if (message) {
      if (!message.replies) {
        message.replies = [];
      }
      message.replies.push(reply);
    }
  }

  addLike(messageId: number, currentUserId?: number) {
    if (currentUserId === undefined) {
      return false;
    }

    if (this.userLikes.get(messageId)?.has(currentUserId)) {
      return false;
    }

    if (!this.userLikes.has(messageId)) {
      this.userLikes.set(messageId, new Set());
    }
    this.userLikes.get(messageId)!.add(currentUserId);
    return true;
  }

  hasUserLiked(messageId: number, userId: number): boolean {
    return this.userLikes.get(messageId)?.has(userId) ?? false;
  }

  getLikesCount(messageId: number): number {
    return this.userLikes.get(messageId)?.size ?? 0;
  }

  // getMessagesByForumId(forumId: number): Message[] {
  //   const config = this.forumConfig[forumId];
  //   const filtered = this.messages.filter(m => m.idForum === forumId);
  //   return config?.sortDesc
  //     ? filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  //     : filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // }

  getMessagesByForumId(forumId: number): Message[] {
return this.messages.filter(m => m.idForum === forumId);
}

  
}
