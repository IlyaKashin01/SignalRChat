import { ChangeDetectorRef, Component, Input, OnInit, } from '@angular/core';
import { ChatService } from '../common/services/chat.service';
import { Dialog, GroupedMessages, Message } from '../common/DTO/chatDto';
import { DataService } from '../common/services/data.service';
import { HubService } from '../common/services/hub.service';
import { PersonResponse } from '../common/DTO/authDto';
import { GroupService } from '../common/services/group.service';
import { Router } from '@angular/router';

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
    countMembers: number = 0;
    creatorLogin: string = "";

    nameDialogNotification: string = '';
    notification: string = '';

    showChat: boolean = false;
    showGroup: boolean = false;
    showUserForm: boolean = false;
    isGroupForm: boolean = false;
    showNotification: boolean = false;
    checked: boolean = false;

    constructor(private router: Router, private chatHub: ChatService, private groupHub: GroupService, private dataService: DataService, private hubService: HubService, private cdr: ChangeDetectorRef) {
    }

    async ngOnInit(): Promise<void> {
        if (await this.hubService.getChatPromiseStart() !== null) {
            await this.chatHub.errorSubscribe()
            await this.chatHub.subscribeOnlineMarkers();
            await this.chatHub.subscribeNotification();
            await this.chatHub.subscribeDialogs();
            await this.chatHub.subscribeNewDialog();
            this.chatHub.dialogs$.subscribe((dialogs: Dialog[]) => {
                this.dialogs = dialogs;
            });
            await this.chatHub.getDialogs();
            await this.chatHub.getOnlineMarkers();
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
            this.chatHub.error$.subscribe((error: string) => {
                if(error !== "")
                    console.error(error);
            })
        }
        if (await this.hubService.getGroupPromiseStart() !== null) {
            await this.groupHub.subscribeNotification();
            this.groupHub.groupName$.subscribe((name: string) => {
                this.nameDialogNotification = name;
            });
            this.groupHub.notification$.subscribe((content: string) => {
                this.notification = content;
                if (this.notification !== '')
                    this.showNotification = true;
            });
            await this.groupHub.subscribeNewGroup();
            this.groupHub.newGroup$.subscribe((dialog: Dialog) => {
                if(dialog.id !== 0){
                this.dialogs.push(dialog);
                this.dialogs.sort((a, b) => a.name.localeCompare(b.name));
                }
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

    async onKeyGroup(id: number, name: string, countMembers: number, creatorLogin: string) {
        this.groupId = id;
        this.nameGroup = name;
        this.countMembers = countMembers;
        this.creatorLogin = creatorLogin;
        if (this.showChat === true)
            this.showChat = false;
        this.showGroup = true;
    }

    async sendMessage() {
        await this.chatHub.sendMessage(this.message, this.recipientId, false);
        this.message = '';
    }
    async changeStatusMessages() {
        this.checked = true;
        await this.chatHub.ChangeStatusIncomingMessages(this.recipientId);
    }
    async logout() {
        await this.groupHub.onDisconnectedGroups();
        this.hubService.DisconnectionChatHub();
        this.hubService.DisconnectionGroupHub();
        this.router.navigate(['']);
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