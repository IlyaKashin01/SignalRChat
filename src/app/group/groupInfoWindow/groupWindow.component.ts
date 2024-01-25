import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PersonResponse } from 'src/app/common/DTO/authDto';
import { GroupService } from '../../common/services/group.service';
import { ChatService } from 'src/app/common/services/chat.service';
import { LeaveGroupRequest, MemberResponse } from '../../common/DTO/groupDto';
import { DataService } from 'src/app/common/services/data.service';
import { HubService } from 'src/app/common/services/hub.service';

@Component({
    selector: 'group-window',
    templateUrl: './groupWindow.component.html',
    styleUrls: ['./groupWindow.component.css'],
    providers: [DataService, GroupService]
})
export class GroupWindowComponent implements OnInit {
    @Input() members: MemberResponse = new MemberResponse("", []);
    @Input() onlineMarkers: number[] = [];  
    @Input() personId: number = 0;
    @Input() groupId: number = 0;
    @Input() groupName: string = '';
    @Output() closeForm = new EventEmitter<void>();
    personName : string = this.dataService.getPerson().login;
    isSubsctibed: boolean = false;

    constructor( private dataService: DataService, private groupHub: GroupService, private hubService: HubService) {
    }
    async ngOnInit(): Promise<void> {
        if (this.hubService.getGroupPromiseStart !== null) {
            if (!this.isSubsctibed) {
                await this.groupHub.subscribeGroupMembers();
                this.groupHub.members$.subscribe((members: MemberResponse) => {
                    this.members = members;
                });
                await this.groupHub.getGroupMembers(this.groupId);
            }
        }
    }

    close() {
        this.closeForm.emit();
    }

    excludeMember(memberId: number, memberLogin: string, creatorLogin: string){
        this.groupHub.LeaveGroup(new LeaveGroupRequest(this.groupId, memberId, memberLogin, creatorLogin));
    }
}
