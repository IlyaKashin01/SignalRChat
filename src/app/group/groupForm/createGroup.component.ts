import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonResponse } from 'src/app/common/DTO/authDto';
import { GroupService } from '../../common/services/group.service';
import { HubService } from 'src/app/common/services/hub.service';
import { Dialog } from 'src/app/common/DTO/commonDto';

@Component({
    selector: 'group-form',
    templateUrl: './createGroup.component.html',
    styleUrls: ['./createGroup.component.css'],
    providers: []
})
export class GroupFormComponent implements OnInit {
    users: PersonResponse[] = [];
    @Output() closeForm = new EventEmitter<void>();
    dialog: Dialog = new Dialog(0,"", "", false, new Date(), 0, "", false, 0, "");
    selectedUserId: number[] = [];
    message: string = "";
    name: string = "";
    isSelected: boolean = false;
    isCreated: boolean = false;
    constructor(private groupHub: GroupService, private hubService: HubService) {
    }
    async ngOnInit(): Promise<void> {
        if (await this.hubService.getGroupPromiseStart() !== null) {
            await this.groupHub.subscribeUsers();
            this.groupHub.users$.subscribe((users: PersonResponse[]) => {
                this.users = users;
            });
            await this.groupHub.subscribeNewGroup();
            this.groupHub.newGroup$.subscribe((dialog: Dialog) => {
                this.dialog = dialog;
            });
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
        await this.groupHub.createGroup(this.name);
        await this.groupHub.getUsers(this.dialog.id);
        this.isCreated = true;
    }
    async joinToGroup() {
        console.log(this.dialog.id);
        
        await this.selectedUserId.forEach(async id => {
            await this.groupHub.joinPersonToGroup(this.dialog.id, id);
        });
        this.close();
    }
}
