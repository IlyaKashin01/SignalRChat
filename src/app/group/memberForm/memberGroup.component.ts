import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonResponse } from 'src/app/common/DTO/authDto';
import { GroupService } from '../../common/services/group.service';
import { ChatService } from 'src/app/common/services/chat.service';
import { HubService } from 'src/app/common/services/hub.service';

@Component({
    selector: 'member-form',
    templateUrl: './memberGroup.component.html',
    styleUrls: ['./memberGroup.component.css'],
    providers: []
})
export class MemberFormComponent implements OnInit {
    users: PersonResponse[] = [];
    @Output() closeForm = new EventEmitter<void>();
    selectedUserId: number[] = [];
    @Input() groupId: number = 0;
    message: string = "";
    name: string = "";
    isSelected: boolean = false;
    subscribed: boolean = false;
    constructor(private groupHub: GroupService, private hubService: HubService) {
    }
    async ngOnInit(): Promise<void> {
        if (await this.hubService.getGroupPromiseStart() !== null) {
            if (!this.subscribed) {
                await this.groupHub.subscribeUsers();
                this.groupHub.users$.subscribe((users: PersonResponse[]) => {
                    this.users = users;
                });

                await this.groupHub.getUsers(this.groupId);
                this.subscribed = true;
            }
        }
    }
    close() {
        this.closeForm.emit();
    }

    selectUser(user: PersonResponse) {
        this.selectedUserId.push(user.id);
        this.isSelected = true;
    }

    cancel() {
        this.message = "";
        this.close();
    }

    async joinToGroup() {
        await this.selectedUserId.forEach(async id => {
            await this.groupHub.joinPersonToGroup(this.groupId, id);
        });
        await this.groupHub.getGroupMembers(this.groupId);
        this.close();
    }
}
