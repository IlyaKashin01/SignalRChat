import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonResponse } from 'src/app/signin/authDto';
import { ChatService } from '../chat.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './dialogForm.component.html',
    styleUrls: ['./dialogForm.component.css']
})
export class UserFormComponent {
    @Input() users: PersonResponse[] = [];
    @Output() closeForm = new EventEmitter<void>();
    selectedUserId: number = 0;
    message: string = "";
    isSelected: boolean = false;
    constructor(private chatHub: ChatService) {
    }
    close() {
        this.closeForm.emit();
    }

    selectUser(user: PersonResponse) {
        this.selectedUserId = user.id;
        this.isSelected = true;
    }

    cancel() {
        this.message = "";
        this.close();
    }

    send() {
        this.chatHub.sendMessage(this.message, this.selectedUserId);
        this.chatHub.getDialogs();
        console.log('Sending message:', this.message);
        this.close();
    }
}
