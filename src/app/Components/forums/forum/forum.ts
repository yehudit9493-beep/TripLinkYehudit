import { Component } from '@angular/core';
import { Forums } from '../../../Service/forums';
import { Message } from '../../../Interfacess/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../Service/auth';

@Component({
  selector: 'app-forum',
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.html',
  styleUrl: './forum.scss',
  standalone: true
})
export class Forum {

  currentForumId: number = 1;

  newMessage: Message = {
    idMessage: 0,
    idForum: 1, // שים לב לעדכן לפי הפורום המתאים
    userId: 1, // יש להעביר מזהה משתמש שמחובר
    userName: '',
    content: '',
    title: '',
    date: new Date(),
    relatedLinks: []
  };

  constructor(private forums: Forums, private auth: Auth,
     private route: ActivatedRoute, private router : Router) { }

  ngOnInit() {

    const forumId = this.route.snapshot.paramMap.get('forumId');
    this.currentForumId = forumId ? +forumId : 1;

    this.newMessage.userId = this.auth.getCurrentUserId();
    this.newMessage.userName = this.auth.getCurrentUserName();
    this.newMessage.idForum = this.currentForumId;

  }

  addMessage() {
    this.newMessage.idMessage = Date.now();
    this.newMessage.date = new Date();
    this.forums.addMessage(this.newMessage);
    this.resetForm();

    this.router.navigate([`/forum/${this.currentForumId}`]);
  }

  cancelMessage() {
    this.router.navigate([`/forum/${this.currentForumId}`]);
  }

  resetForm() {
    this.newMessage = {
      idMessage: 0,
      idForum: this.currentForumId,
      userId: 0,
      userName: '',
      title: '',
      content: '',
      date: new Date(),
      relatedLinks: []
    };
  }

}
