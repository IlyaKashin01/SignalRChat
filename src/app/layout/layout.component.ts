import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonResponse } from '../common/DTO/authDto';
import { Dialog, LastMessage, Notification } from '../common/DTO/commonDto';
import { ChatService } from '../common/services/chat.service';
import { DataService } from '../common/services/data.service';
import { GroupService } from '../common/services/group.service';
import { HubService } from '../common/services/hub.service';
import { GroupParams } from '../common/DTO/groupDto';

@Component({
  selector: 'layout', 
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: []
})
export class LayoutComponent implements OnInit {
  person: PersonResponse = this.dataService.getPerson();

  recipientId: number = 0;
  personId: number = this.person.id;

  dialogs: Dialog[] = [];
  onlineMarkers: number[] = [];
  hideCounterKey: number = 0;

  notification: Notification = new Notification("", "");

  showUserForm: boolean = false;
  isGroupForm: boolean = false;
  showNotification: boolean = false;
  checked: boolean = false;
  
  constructor(private router: Router, private route: ActivatedRoute, private chatHub: ChatService, private groupHub: GroupService, private dataService: DataService, private hubService: HubService, private cdr: ChangeDetectorRef) {
  }

    async ngOnInit(): Promise<void> {
        if (await this.hubService.getChatPromiseStart() !== null) {
            await this.chatHub.errorSubscribe()
            await this.chatHub.subscribeOnlineMarkers();
            await this.chatHub.subscribeNotification();
            await this.chatHub.subscribeDialogs();
            await this.chatHub.subscribeNewDialog();
            this.chatHub.dialogs$.subscribe((dialogs: Dialog[]) => {
                this.dialogs = dialogs;
            });
            await this.chatHub.getDialogs();
            await this.chatHub.getOnlineMarkers();
            this.chatHub.onlineMarkers$.subscribe((markers: number[]) => {
                this.onlineMarkers = markers;
            });
            this.chatHub.notification$.subscribe((notification: Notification) => {
                const dialog = this.dialogs.find(x => x.name === notification.title);
                if (dialog) dialog.countUnreadMessages++;
                this.notification = notification;
                if (this.notification.message !== '')
                    this.showNotification = true;
            });
            this.chatHub.error$.subscribe((error: string) => {
                if (error !== "")
                    console.error(error);
            })
        }
        if (await this.hubService.getGroupPromiseStart() !== null) {
            await this.groupHub.subscribeNotification();
            this.groupHub.notification$.subscribe((notification: Notification) => {
                const dialog = this.dialogs.find(x => x.name === notification.title);
                if (dialog) dialog.countUnreadMessages++;
                this.notification = notification;
                if (this.notification.message !== '')
                    this.showNotification = true;
            });
            await this.groupHub.subscribeNewGroup();
            this.groupHub.newGroup$.subscribe((dialog: Dialog) => {
                if (dialog.id !== 0) {
                    this.dialogs.push(dialog);
                    this.dialogs.sort((a, b) => a.name.localeCompare(b.name));
                }
            });
        }
        this.dataService.hideCounterKey$.subscribe((value: number) => {
            const dialog = this.dialogs.find(x => x.id === value);
            if(dialog) dialog.countUnreadMessages = 0;
        })
    }

  close() {
      this.showNotification = false;
  }

  async onKeyChat(id: number, name: string, countUnreadMessages: number) {
      if (countUnreadMessages > 0) {
        await this.chatHub.ChangeStatusIncomingMessages(id);
        const dialog = this.dialogs.find(x => x.name === name);
        if(dialog) dialog.countUnreadMessages = 0;
      }
      this.dataService.setDialogName(name);
      this.dataService.setRecipientId(id);
      this.router.navigate(['chat'], {relativeTo: this.route});
  }

  async onKeyGroup(id: number, name: string, countMembers: number, creatorLogin: string, countUnreadMessages: number) {
      await this.dataService.setGroupParams(new GroupParams(name, countMembers, id, creatorLogin, this.person.login, this.onlineMarkers));
      if (countUnreadMessages > 0) {
        await this.groupHub.ChangeStatusIncomingMessages(id, name);
        const dialog = this.dialogs.find(x => x.name === name);
        if(dialog) dialog.countUnreadMessages = 0;
      }
      this.router.navigate(['group'], {relativeTo: this.route});
  }

  async logout() {
      await this.groupHub.onDisconnectedGroups();
      this.hubService.DisconnectionChatHub();
      this.hubService.DisconnectionGroupHub();
      this.router.navigate(['']);
  }
  openUserForm() {
      this.showUserForm = true;
  }

  closeUserForm() {
      this.showUserForm = false;
  }
  openGroupForm() {
      this.isGroupForm = true;
  }

  closeGroupForm() {
      this.isGroupForm = false;
  }

  getLastMessage(message: string, isCheck: boolean, sentAt: Date, counter: number, login: string): LastMessage
  {
    return new LastMessage(message, isCheck, new Date(sentAt), counter, login);
  }
}
