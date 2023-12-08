import { Component, Input, OnInit, } from '@angular/core';
import { ChatService } from './chat.service';
import { Dialog, GroupedMessages, Message } from './Dto';
import { DataService } from '../data.service';
import { HubService } from '../hub.service';
import { PersonResponse } from '../signin/authDto';
import { HubConnection } from '@aspnet/signalr';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    person: PersonResponse = this.dataService.getPerson();
    message: string = "";

    personalMessages: GroupedMessages[] = [];
    personalMessage: Message | undefined;

    recipientId: number = 0;
    personId: number = this.person.id;

    dialogs: Dialog[] = [];
    nameDialog: string = "";
    onlineMarkers: number[] = [];

    groupId: number = 0;
    nameGroup: string = "";

    users: PersonResponse[] = [];

    showChat: boolean = false;
    showGroup: boolean = false;
    showUserForm: boolean = false;
    isGroupForm: boolean = false;

    constructor(private chatHub: ChatService, private dataService: DataService, private hubService: HubService) {
    }

    async ngOnInit(): Promise<void> {
        await this.hubService.Connection(`https://localhost:7130/group?access_token=${this.dataService.getToken()}`, 'group', this.personId);
        if (await this.hubService.getPromiseSrart() !== null) {
            await this.chatHub.subscribeOnlineMarkers();
            await this.chatHub.subscribeDialogs();
            await this.chatHub.subscribeNewDialog();
            await this.chatHub.subscribeUsers();
            this.chatHub.dialogs$.subscribe((dialogs: Dialog[]) => {
                this.dialogs = dialogs;
            });
            this.chatHub.users$.subscribe((users: PersonResponse[]) => {
                this.users = users;
            });
            await this.chatHub.getDialogs();
            await this.chatHub.getOnlineMarkers();
            await this.chatHub.getUsers();
            await this.chatHub.subscribeAllPersonalMessages();
            await this.chatHub.subscribeNewPersonalMessages();
            await this.chatHub.subscribeMessagesWithNewStatus();
            this.chatHub.personalmessages$.subscribe((messages: GroupedMessages[]) => {
                this.personalMessages = messages;
            });
            this.chatHub.message$.subscribe((message: Message) => {
                this.personalMessage = message;
            });
            this.chatHub.onlineMarkers$.subscribe((markers: number[]) => {
                this.onlineMarkers = markers;
            });
        }
    }

    async onKeyChat(id: number, name: string) {
        if (this.showGroup === true)
            this.showGroup = false;
        this.showChat = true;
        if (this.recipientId !== 0) await this.chatHub.ChangeStatusIncomingMessages(id);
        this.recipientId = id;
        this.nameDialog = name;
        await this.chatHub.getAllPersonalMessages(id);
    }

    async onKeyGroup(id: number, name: string) {
        this.groupId = id;
        if (this.showChat === true)
            this.showChat = false;
        this.showGroup = true;
        this.nameGroup = name;
    }

    async sendMessage() {
        await this.chatHub.sendMessage(this.message, this.recipientId);
        this.message = '';
    }
    async changeStatusMessages() {
        //await this.chatHub.ChangeStatusIncomingMessages(this.recipientId);
    }
    openUserForm() {
        this.showUserForm = true;
    }

    closeUserForm() {
        this.showUserForm = false;
    }
    openGroupForm() {
        this.isGroupForm = true;
    }

    closeGroupForm() {
        this.isGroupForm = false;
    }
}