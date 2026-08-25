import { Component } from '@angular/core';
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
  standalone: true
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
    private snackBar: MatSnackBar) { }

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

    let messages = this.forums.getMessagesByForumId(this.currentForumId);

   
    if (this.currentForumId === 3) { 
      messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else { 
      messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    this.message = messages;
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

    const reply: Reply = {
      idMessage: this.generateMessageId(),
      idForum: this.currentForumId,
      userId: this.currentUserId,
      userName: this.currentUserName,
      content: this.newReply.content,
      date: new Date(),
      relatedLinks: [],
      replies: []
    };

    this.forums.addReply(messageId, reply);
    this.message = [...this.message];
    this.newReply = { content: '' };
    this.replyIndex = null;
  }

  private generateMessageId(): number {
    return Math.max(...this.message.flatMap(m => [m.idMessage, ...(m.replies?.map(r => r.idMessage) || [])]), 0) + 1;
  }


  toggleReplyForm(index: number) {
    this.replyIndex = this.replyIndex === index ? null : index;
  }

  addLike(messageId: number) {
    const success = this.forums.addLike(messageId, this.currentUserId);
    if (!success) {
      this.snackBar.open('כבר סימנת לייק להודעה זו! ❤️', '', {
        duration: 2500,
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
  }

  hasUserLiked(messageId: number): boolean {
    return this.forums.hasUserLiked(messageId, this.currentUserId);
  }

  private updateLikesDisplay(messageId: number) {
    this.likesCount = this.forums.getLikesCount(messageId);
    this.isLiked = this.forums.hasUserLiked(messageId, this.currentUserId);
  }

  getLikesCount(messageId: number): number {
    return this.forums.getLikesCount(messageId);
  }

}
