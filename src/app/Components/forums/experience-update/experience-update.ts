import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Forums } from '../../../Service/forums';
import { Message, Reply } from '../../../Interfacess/message';
import { DatePipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../Service/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-experience-update',
  imports: [DatePipe, SlicePipe, FormsModule],
  templateUrl: './experience-update.html',
  styleUrl: './experience-update.scss',
  standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExperienceUpdate {

  message: Message[] = [];

  showMoreIndex: number | null = null;
  showMoreReplyIndex: Map<number, boolean> = new Map();

  private readonly CONTENT_LENGTH_LIMIT = 150;

  newReply: { content: string } = { content: '' };
  replyIndex: number | null = null;

  currentForumId: number = 1;
  currentUserId: number = 1;
  currentUserName: string = 'משתמש';

  forumTitle: string = '';
  forumSubtitle: string = '';
  canPost: boolean = false;
  canReply: boolean = false;

  likesCount: number = 0;
  isLiked: boolean = false;

  constructor(private forums: Forums,
    private router: Router,
    private route: ActivatedRoute, private auth: Auth,
    private snackBar: MatSnackBar,
   private cdr: ChangeDetectorRef ) { }

  ngOnInit() {
    this.currentUserId = this.auth.getCurrentUserId();
    this.currentUserName = this.auth.getCurrentUserName();
    const userPermission = this.auth.getCurrentUserPermission();

    const forumId = this.route.snapshot.paramMap.get('forumId');
    this.currentForumId = forumId ? +forumId : 1;

    const config = this.forums.forumConfig[this.currentForumId];
    if (config) {
      this.forumTitle = config.title;
      this.forumSubtitle = config.subtitle;
      this.canPost = config.canPost.includes(userPermission);
      this.canReply = config.canReply.includes(userPermission);
    }

    this.loadMessages();
  }

private loadMessages() {
  this.forums.getMessagesByForumId(this.currentForumId).subscribe(messages => {
    console.log('🔵 נתונים שהגיעו מהשרת:', messages); 
    
    if (this.currentForumId === 3) {
      messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    this.message = messages;
    this.cdr.markForCheck();
    console.log('🟢 נתונים אחרי מיון:', this.message); 
  });
  

}
  toggleShowMore(index: number) {
    this.showMoreIndex = this.showMoreIndex === index ? null : index;
  }

   toggleShowMoreReply(replyId: number) {
    const currentState = this.showMoreReplyIndex.get(replyId) || false;
    this.showMoreReplyIndex.set(replyId, !currentState);
  }

  shouldShowMoreReply(replyId: number): boolean {
    return this.showMoreReplyIndex.get(replyId) || false;
  }

  goToAdd() {
    this.router.navigate(['/addbForum', this.currentForumId]);
  }

  addReply(messageId: number) {
    if (!this.newReply.content.trim()) {
      return;
    }

    const replyPayload = {
      userId: this.currentUserId,
      forumTypeId: this.currentForumId,
      title: '',
      content: this.newReply.content
    };

    this.forums.addReply(messageId, replyPayload).subscribe(() => {
      this.loadMessages(); // רענון ההודעות מהשרת
      this.newReply = { content: '' };
      this.replyIndex = null;
    });
  }

  toggleReplyForm(index: number) {
    this.replyIndex = this.replyIndex === index ? null : index;
  }

  addLike(messageId: number) {
    this.forums.toggleLike(messageId, this.currentUserId).subscribe(liked => {
      if (!liked) {
        this.snackBar.open('הסרת לייק ❤️', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['info-snackbar']
        });
      } else {
        this.snackBar.open('לייק הוסף בהצלחה! 👍', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      }
      this.updateLikesDisplay(messageId);
    });
  }

  hasUserLiked(messageId: number): boolean {
    const msg = this.message.find(m => m.idMessage === messageId);
    return msg ? (msg.likes ?? 0) > 0 : false;
  }

  private updateLikesDisplay(messageId: number) {
    const msg = this.message.find(m => m.idMessage === messageId);
    this.likesCount = msg?.likes ?? 0;
  }

  getLikesCount(messageId: number): number {
    const msg = this.message.find(m => m.idMessage === messageId);
    return msg?.likes ?? 0;
  }

}
