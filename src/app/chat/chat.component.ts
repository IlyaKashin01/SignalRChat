import { Component, OnInit, } from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from './Dto';
import { DataService } from '../data.service';
import { PersonResponse } from '../signin/authDto';

@Component({
    selector: 'signin',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    inputValue: string = "";
    personalMessages: Message[] = [];
    personalMessage: Message | undefined;
    recipientId: number = this.dataService.getRecipientId();
    dialogs: PersonResponse[] = [];
    show: boolean = false;
    constructor(private chatHub: ChatService, private dataService: DataService,) {
    }
    onKey(event: any) {
        this.inputValue = event.target.value;
    }
    async onKeyRecipientId(id: number) {
        this.show = true;
        await this.chatHub.getAllPersonalMessages(id);
    }
    async ngOnInit(): Promise<void> {
        if (await this.chatHub.getConnection() !== null) {
            await this.chatHub.subscribeDialogs();
            this.chatHub.dialogs$.subscribe((dialogs: PersonResponse[]) => {
                this.dialogs = dialogs;
            });
            await this.chatHub.getDialogs();
            await this.chatHub.subscribeAllPersonalMessages();
            await this.chatHub.subscribeNewPersonalMessages();
            this.chatHub.personalmessages$.subscribe((messages: Message[]) => {
                this.personalMessages = messages;
            });
            this.chatHub.message$.subscribe((message: Message) => {
                this.personalMessage = message;
            });
        }
    }

    async sendMessage(message: string) { await this.chatHub.sendMessage(message, this.recipientId); }
}