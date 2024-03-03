import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { ChatService } from '../common/services/chat.service';
import { GroupedMessages, Message } from '../common/DTO/chatDto';
import { DataService } from '../common/services/data.service';
import { HubService } from '../common/services/hub.service';
import { PersonResponse } from '../common/DTO/authDto';
import { GroupService } from '../common/services/group.service';
import { Dialog } from '../common/DTO/commonDto';

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: []
})
export class ChatComponent implements OnInit {
    @ViewChild('historyContainer') historyContainer!: ElementRef;
    
    person: PersonResponse = this.dataService.getPerson();
    message: string = "";

    personalMessages: GroupedMessages[] = [];

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

    constructor(private chatHub: ChatService, private dataService: DataService, private hubService: HubService,) {
    }
    scrollToBottom(): void {
        if (this.historyContainer && this.historyContainer.nativeElement) {
          this.historyContainer.nativeElement.scrollTop = this.historyContainer.nativeElement.scrollHeight;
        }
    }
    async ngOnInit(): Promise<void> {
        if (await this.hubService.getChatPromiseStart() !== null) {
            await this.chatHub.errorSubscribe()
            await this.chatHub.subscribeAllPersonalMessages();
            await this.chatHub.subscribeNewPersonalMessages();
            await this.chatHub.subscribeMessagesWithNewStatus();
            this.chatHub.personalmessages$.subscribe((messages: GroupedMessages[]) => {
                this.personalMessages = messages;
            });
            this.chatHub.error$.subscribe((error: string) => {
                if (error !== "")
                    console.error(error);
            })
        }
        this.dataService.dialogName$.subscribe((value: string) => {
            this.nameDialog = value;
        });

        this.dataService.recipientId$.subscribe(async (id: number) => {
            if (id !== 0 && id !== this.recipientId){ 
                await this.chatHub.getAllPersonalMessages(id);
                this.scrollToBottom();
            }
            this.recipientId = id;
        });
    }
    async sendMessage() {
        await this.chatHub.sendMessage(this.message, this.recipientId, false);
        this.message = '';
    }
    async changeStatusMessages() {
        this.checked = true;
        await this.dataService.setHideCounterKey(this.recipientId);
        await this.chatHub.ChangeStatusIncomingMessages(this.recipientId);
    }
}