import { Component, OnInit, } from '@angular/core';
import { ChatService } from './chat.service';
import { Dialog, GroupedMessages, Message } from './Dto';
import { DataService } from '../data.service';
import { HubService } from '../hub.service';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    inputValue: string = "";

    personalMessages: GroupedMessages[] = [];
    personalMessage: Message | undefined;

    recipientId: number = 0;
    personId: number = this.dataService.getPersonId();

    dialogs: Dialog[] = [];
    nameDialog: string = "";

    showChat: boolean = false;
    showGroup: boolean = false;

    constructor(private chatHub: ChatService, private dataService: DataService, private hubService: HubService) {
    }

    onKey(value: string) {
        this.inputValue = value;
    }

    async onKeyChat(id: number, name: string) {
        if (this.showGroup === true)
            this.showGroup = false;
        this.showChat = true;
        this.recipientId = id;
        this.nameDialog = name;
        await this.chatHub.getAllPersonalMessages(id);
    }

    async onKeyGroup(id: number) {
        if (this.showChat === true)
            this.showChat = false;
        this.showGroup = true;
        await this.dataService.setGroupId(id);
    }

    async sendMessage(message: string) {
        await this.chatHub.sendMessage(message, this.recipientId);
        this.inputValue = '';
    }

    async ngOnInit(): Promise<void> {
        if (await this.hubService.getPromiseSrart() !== null) {
            await this.chatHub.subscribeDialogs();
            this.chatHub.dialogs$.subscribe((dialogs: Dialog[]) => {
                this.dialogs = dialogs;
            });
            await this.chatHub.getDialogs();
            await this.chatHub.subscribeAllPersonalMessages();
            await this.chatHub.subscribeNewPersonalMessages();
            this.chatHub.personalmessages$.subscribe((messages: GroupedMessages[]) => {
                this.personalMessages = messages;
            });
            this.chatHub.message$.subscribe((message: Message) => {
                this.personalMessage = message;
            });
        }
    }
}