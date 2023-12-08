import { Component, Input, OnChanges, SimpleChanges, } from '@angular/core';
import { GroupService } from './group.service';
import { GroupMessage, GroupedMessagesInGroup, MemberResponse } from './Dto';
import { DataService } from '../data.service';
import { HubService } from '../hub.service';

@Component({
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css'],
    providers: [GroupService]
})
export class GroupComponent implements OnChanges {
    @Input() nameGroup: string = "";
    @Input() groupId: number = 0;

    message: string = "";

    groupMessages: GroupedMessagesInGroup[] = [];
    members: MemberResponse = new MemberResponse("", []);

    personId: number = this.dataService.getPerson().id;
    isOpen: boolean = false;
    isSubsctibed: boolean = false;

    constructor(private groupHub: GroupService, private dataService: DataService, private hubService: HubService) {
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes['nameGroup'] || changes['groupId']) {
            if (this.hubService.getPromiseSrart !== null) {
                if (!this.isSubsctibed) {
                    await this.groupHub.onConnectedGroup();
                    await this.groupHub.subscribeGroupMessages();
                    await this.groupHub.subscribeNewGroupMessages();
                    await this.groupHub.subscribeGroupMembers();
                    this.groupHub.groupmessages$.subscribe((messages: GroupedMessagesInGroup[]) => {
                        this.groupMessages = messages;
                    });
                    this.groupHub.members$.subscribe((members: MemberResponse) => {
                        this.members = members;
                    });
                    this.isSubsctibed = true;
                }
                await this.groupHub.getGroupMessages(this.groupId);
                await this.groupHub.getGroupMembers(this.groupId);
            }
        }
    }

    openForm() {
        this.isOpen = true;
    }
    closeForm() {
        this.isOpen = false;
    }
    async createGroup(name: string) {
        await this.groupHub.createGroup(name);
    }
    async sendGroupMessage() {
        await this.groupHub.sendGroupMessage(this.groupId, this.message);
        this.message = "";
    }
    async joinPersonToGroup(groupId: number, memberId: number) {
        await this.groupHub.joinPersonToGroup(groupId, memberId);
        this.isOpen = false;
    }
}