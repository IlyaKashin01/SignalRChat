import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonResponse } from 'src/app/common/DTO/authDto';
import { ChatService } from '../../common/services/chat.service';
import { HubService } from 'src/app/common/services/hub.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './dialogForm.component.html',
    styleUrls: ['./dialogForm.component.css']
})
export class UserFormComponent implements OnInit {
    users: PersonResponse[] = [];
    @Output() closeForm = new EventEmitter<void>();
    selectedUserId: number = 0;
    message: string = "";
    isSelected: boolean = false;
    constructor(private chatHub: ChatService, private hubService: HubService) {
    }
    async ngOnInit(): Promise<void> {
        if (await this.hubService.getChatPromiseStart() !== null) {
        this.chatHub.subscribeUsers();
        this.chatHub.users$.subscribe((users: PersonResponse[]) => {
            this.users = users;
        });
        await this.chatHub.getUsers();
        }
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
        this.chatHub.sendMessage(this.message, this.selectedUserId, true);
        console.log('Sending message:', this.message);
        this.close();
    }
}
