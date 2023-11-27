import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonResponse } from 'src/app/signin/authDto';
import { GroupService } from '../group.service';
import { ChatService } from 'src/app/chat/chat.service';
import { HubService } from 'src/app/hub.service';

@Component({
    selector: 'group-form',
    templateUrl: './createGroup.component.html',
    styleUrls: ['./createGroup.component.css'],
    providers: [GroupService, ChatService]
})
export class GroupFormComponent implements OnInit {
    users: PersonResponse[] = [];
    @Output() closeForm = new EventEmitter<void>();
    selectedUserId: number[] = [];
    groupId: number = 0;
    message: string = "";
    name: string = "";
    isSelected: boolean = false;
    constructor(private groupHub: GroupService, private hub: ChatService, private hubService: HubService) {
    }
    async ngOnInit(): Promise<void> {
        if (await this.hubService.getPromiseSrart() !== null) {
            await this.groupHub.subscribeUsers();
            this.groupHub.users$.subscribe((users: PersonResponse[]) => {
                this.users = users;
            });
            await this.groupHub.subscribeNewGroup();
            this.groupHub.newGroupId$.subscribe((key: number) => {
                this.groupId = key;
            });
            await this.groupHub.getUsers();
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

    async create() {
        await this.groupHub.subscribeNewGroup();
        this.groupHub.newGroupId$.subscribe((key: number) => {
            this.groupId = key;
        });
        await this.groupHub.createGroup(this.name);
        this.hub.getDialogs();
        this.groupHub.getUsers();
    }
    async joinToGroup() {
        await this.selectedUserId.forEach(async id => {
            await this.groupHub.joinPersonToGroup(this.groupId, id);
        });
        this.close();
    }
}
