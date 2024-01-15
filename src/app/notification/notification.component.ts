import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
    @Input() title: string = '';
    @Input() message: string = '';
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
