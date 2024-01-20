import { Component, Input, OnChanges, SimpleChanges, } from '@angular/core';
import { GroupService } from '../common/group.service';
import { GroupedMessagesInGroup, LeaveGroupRequest, MemberResponse } from './Dto';
import { DataService } from '../common/data.service';
import { HubService } from '../common/hub.service';

@Component({
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css'],
    providers: [GroupService]
})
export class GroupComponent implements OnChanges {
    @Input() nameGroup: string = "";
    @Input() groupId: number = 0;
    @Input() personLogin: string = "";
    @Input() onlineMarkers: number[] = [];

    message: string = "";

    groupMessages: GroupedMessagesInGroup[] = [];
    members: MemberResponse = new MemberResponse("", []);
    countMembers: number = 0;
    addedNotifications: string[] = [''];
    groupName: string = '';
    notification: string = '';
    showNotification: boolean = false;
    personId: number = this.dataService.getPerson().id;
    isOpen: boolean = false;
    isOpenWindow: boolean = false;
    isSubsctibed: boolean = false;
    personStatus: boolean = false;

    constructor(private groupHub: GroupService, private dataService: DataService, private hubService: HubService) {
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes['nameGroup'] || changes['groupId']) {
            if (this.hubService.getGroupPromiseStart !== null) {
                if (!this.isSubsctibed) {
                    await this.groupHub.errorSubscribe();
                    await this.groupHub.subscribeGroupMessages();
                    await this.groupHub.subscribeNewGroupMessages();
                    await this.groupHub.subscribeGroupMembers();
                    await this.groupHub.subscribeJoinPersonToGroup();
                    await this.groupHub.subscribeMessagesWithNewStatus();
                    await this.groupHub.subscribePersonStatus();
                    this.groupHub.groupmessages$.subscribe((messages: GroupedMessagesInGroup[]) => {
                        this.groupMessages = messages;
                    });
                    this.groupHub.members$.subscribe((members: MemberResponse) => {
                        this.members = members;
                        this.countMembers = members.groupMembers.length + 1;
                    });
                    this.groupHub.status$.subscribe((status: boolean) => {
                        this.personStatus = status;
                    })
                    this.groupHub.error$.subscribe((error: string) => {
                        console.log(error);
                    })
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
    openWindow() {
        this.isOpenWindow = true;
    }
    closeWindow() {
        this.isOpenWindow = false;
    }
    close() {
        this.showNotification = false;
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
    async changeStatusMessages() {
        await this.groupHub.ChangeStatusIncomingMessages(this.groupId, this.nameGroup);
    }
    async leaveGroup() {
        await this.groupHub.LeaveGroup(new LeaveGroupRequest(this.groupId, this.personId, this.personLogin, ""));
    }
    async returnToGroup() {
        await this.groupHub.ReturnToGroup(this.groupId, this.nameGroup, this.personLogin);
    }
}