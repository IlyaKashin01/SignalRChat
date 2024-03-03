import { Component } from '@angular/core';
import { ChatService } from './common/services/chat.service';
import { GroupService } from './common/services/group.service';
import { DataService } from './common/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ChatService, GroupService, DataService]
})
export class AppComponent {
  title = 'SignalRChat';
}
