import { Component } from '@angular/core';
import { ChatService } from './common/services/chat.service';
import { GroupService } from './common/services/group.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ChatService, GroupService]
})
export class AppComponent {
  title = 'SignalRChat';
}
