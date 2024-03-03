import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Notification } from '../common/DTO/commonDto';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
    @Input() notification: Notification = new Notification("", "");
    @Input() isShow: boolean = false;
    @Output() close = new EventEmitter<void>();
    subsctibtion: Subscription;
    constructor() {
        this.subsctibtion = interval(3000).subscribe(() => {
          this.onClose();
        })
      }    

    onClose() {
        this.close.emit();
    }
}
