import { Component, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { GroupMessage, GroupedMessagesInGroup, MemberResponse } from './Dto';
import { DataService } from '../data.service';

@Component({
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css'],
    providers: [GroupService]
})
export class GroupComponent implements OnInit {
    inputValue: string = "";

    groupMessages: GroupedMessagesInGroup[] = [];
    members: MemberResponse = new MemberResponse("", []);
    newMessage: GroupMessage | undefined;

    personId: number = this.dataService.getPersonId();
    isOpen: boolean = false;

    constructor(private chatHub: GroupService, private dataService: DataService) {
    }

    async ngOnInit(): Promise<void> {
        await this.chatHub.subscribeGroupMessages();
        await this.chatHub.subscribeNewGroupMessages();
        await this.chatHub.subscribeGroupMembers();
        await this.chatHub.getGroupMessages();
        await this.chatHub.getGroupMembers();
        this.chatHub.groupmessages$.subscribe((messages: GroupedMessagesInGroup[]) => {
            this.groupMessages = messages;
        });
        this.chatHub.message$.subscribe((message: GroupMessage) => {
            this.newMessage = message;
        });
        this.chatHub.members$.subscribe((members: MemberResponse) => {
            this.members = members;
        });
    }
    onKey(event: any) {
        this.inputValue = event.target.value;
    }
    openForm() {
        this.isOpen = true;
    }
    async createGroup(name: string) {
        await this.chatHub.createGroup(name);
    }
    async sendGroupMessage(message: string) {
        await this.chatHub.sendGroupMessage(message);
        this.inputValue = "";
    }
    async joinPersonToGroup(memberId: number) {
        await this.chatHub.joinPersonToGroup(memberId);
        this.isOpen = false;
    }
}