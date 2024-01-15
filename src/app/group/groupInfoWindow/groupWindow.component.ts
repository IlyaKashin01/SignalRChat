import { Component, EventEmitter, Input, Output} from '@angular/core';
import { PersonResponse } from 'src/app/signin/authDto';
import { GroupService } from '../../common/group.service';
import { ChatService } from 'src/app/common/chat.service';
import { MemberResponse } from '../Dto';
import { DataService } from 'src/app/common/data.service';

@Component({
    selector: 'group-window',
    templateUrl: './groupWindow.component.html',
    styleUrls: ['./groupWindow.component.css'],
    providers: [DataService]
})
export class GroupWindowComponent {
    @Input() members: MemberResponse = new MemberResponse("", []);
    @Input() onlineMarkers: number[] = [];  
    @Input() personId: number = 0;
    @Output() closeForm = new EventEmitter<void>();
    personName : string = this.dataService.getPerson().login;
    
    constructor( private dataService: DataService) {
    }

    close() {
        this.closeForm.emit();
    }
}
