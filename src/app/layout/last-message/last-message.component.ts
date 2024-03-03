import { Component, Input } from '@angular/core';
import { LastMessage } from 'src/app/common/DTO/commonDto';

@Component({
  selector: 'last-message',
  templateUrl: './last-message.component.html',
  styleUrls: ['./last-message.component.css']
})
export class LastMessageComponent {
  currentDate = new Date();
  @Input() lastMessage: LastMessage = new LastMessage(0,"", false, new Date(), "")
  @Input() personLogin: string = "";

  isDifferentYear(sentAt: Date): boolean {
    return sentAt.getFullYear() !== this.currentDate.getFullYear();
  }

  isDifferentDay(sentAt: Date): boolean {
    return sentAt.getDate() !== this.currentDate.getDate();
  }
}
