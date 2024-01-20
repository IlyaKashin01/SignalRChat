import { Component, Input, OnInit, } from '@angular/core';
import { ChatService } from '../common/chat.service';
import { Dialog, GroupedMessages, Message } from './Dto';
import { DataService } from '../common/data.service';
import { HubService } from '../common/hub.service';
import { PersonResponse } from '../signin/authDto';
import { GroupService } from '../common/group.service';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService, GroupService]
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

    nameDialogNotification: string = '';
    notification: string = '';

    showChat: boolean = false;
    showGroup: boolean = false;
    showUserForm: boolean = false;
    isGroupForm: boolean = false;
    showNotification: boolean = false;

    constructor(private chatHub: ChatService, private groupHub: GroupService, private dataService: DataService, private hubService: HubService) {
    }

    async ngOnInit(): Promise<void> {
        if (await this.hubService.getChatPromiseStart() !== null) {
            await this.chatHub.subscribeOnlineMarkers();
            await this.chatHub.subscribeNotification();
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
            this.chatHub.nameDialog$.subscribe((name: string) => {
                this.nameDialogNotification = name;
            });
            this.chatHub.notification$.subscribe((content: string) => {
                this.notification = content;
                if(this.notification !== '')
                this.showNotification = true;
            });
        }
        if(await this.hubService.getGroupPromiseStart() !== null) {
            await this.groupHub.subscribeNotification();
            this.groupHub.groupName$.subscribe((name: string) => {
                this.nameDialogNotification = name;
            });
            this.groupHub.notification$.subscribe((content: string) => {
                this.notification = content;
                if(this.notification !== '')
                this.showNotification = true;
            });
        }
    }

    close() {
        this.showNotification = false;
    }

    async onKeyChat(id: number, name: string) {
        if (this.showGroup === true)
            this.showGroup = false;
        this.showChat = true;
        //if (this.recipientId !== 0) await this.chatHub.ChangeStatusIncomingMessages(id);
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
        await this.chatHub.sendMessage(this.message, this.recipientId, false);
        this.message = '';
    }
    async changeStatusMessages() {
        await this.chatHub.ChangeStatusIncomingMessages(this.recipientId);
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