import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonResponse } from 'src/app/signin/authDto';
import { GroupService } from '../group.service';
import { ChatService } from 'src/app/chat/chat.service';
import { HubService } from 'src/app/hub.service';
import { DataService } from 'src/app/data.service';

@Component({
    selector: 'member-form',
    templateUrl: './memberGroup.component.html',
    styleUrls: ['./memberGroup.component.css'],
    providers: [GroupService, ChatService]
})
export class MemberFormComponent implements OnInit {
    users: PersonResponse[] = [];
    @Output() closeForm = new EventEmitter<void>();
    selectedUserId: number[] = [];
    @Input() groupId: number = 0;
    message: string = "";
    name: string = "";
    isSelected: boolean = false;
    constructor(private groupHub: GroupService, private hubService: HubService, private dataService: DataService) {
    }
    async ngOnInit(): Promise<void> {
        if (await this.hubService.getPromiseSrart() !== null) {
            await this.groupHub.subscribeUsers();
            this.groupHub.users$.subscribe((users: PersonResponse[]) => {
                this.users = users;
            });

            await this.groupHub.getUsers(this.groupId);
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
