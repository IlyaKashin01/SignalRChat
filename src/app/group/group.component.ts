import { Component, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { GroupMessage } from './Dto';

@Component({
    selector: 'signin',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css'],
    providers: [GroupService]
})
export class GroupComponent implements OnInit {
    inputValue: string = "";
    groupMessages: GroupMessage[] = [];

    constructor(private chatHub: GroupService,) {
    }
    onKey(event: any) {
        this.inputValue = event.target.value;
    }

    async ngOnInit(): Promise<void> {
        await this.chatHub.connect();
        await this.chatHub.subscribeGroupMessages();
        await this.chatHub.getGroupMessages();
        this.chatHub.groupmessages$.subscribe((messages: GroupMessage[]) => {
            this.groupMessages = messages;
        });

    }

    createGroup(name: string) { this.chatHub.createGroup(name); }
    sendGroupMessage(message: string) { this.chatHub.sendGroupMessage(message); }
    joinPersonToGroup() { this.chatHub.joinPersonToGroup(); }
}