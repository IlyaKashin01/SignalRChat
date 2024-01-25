import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "./data.service";
import { BehaviorSubject, } from "rxjs";
import { GroupMessage, GroupMessageRequest, GroupedMessagesInGroup, LeaveGroupRequest, MemberRequest, MemberResponse } from "../DTO/groupDto";
import { GroupRequest } from "../DTO/groupDto";
import { HubService } from "./hub.service";
import { PersonResponse } from "../DTO/authDto";
import { Dialog } from "../DTO/chatDto";

@Injectable()
export class GroupService {
    constructor(private dataService: DataService, private hubService: HubService) { }

    private groupMessages: GroupedMessagesInGroup[] = [];
    private groupMessagesSource = new BehaviorSubject<GroupedMessagesInGroup[]>([]);
    groupmessages$ = this.groupMessagesSource.asObservable();

    private messageSource = new BehaviorSubject<GroupMessage>(new GroupMessage(0, 0,"", "", new Date, false));
    message$ = this.messageSource.asObservable();

    private membersSource = new BehaviorSubject<MemberResponse>(new MemberResponse("", []));
    members$ = this.membersSource.asObservable();

    private usersSource = new BehaviorSubject<PersonResponse[]>([]);
    users$ = this.usersSource.asObservable();

    private addedNotificationSource = new BehaviorSubject<string[]>(['']);
    addedNotifications$ = this.addedNotificationSource.asObservable();

    private notificationSource = new BehaviorSubject<string>('');
    notification$ = this.notificationSource.asObservable();
    private groupNameSource = new BehaviorSubject<string>('');
    groupName$ = this.groupNameSource.asObservable();

    private statusSource = new BehaviorSubject<boolean>(false);
    status$ = this.statusSource.asObservable();

    token: string = "";
    personId: number = this.dataService.getPerson().id;
    groupId: number = this.dataService.getGroupId();
    private newGroupSource = new BehaviorSubject<Dialog>(new Dialog(0,"", "", false, new Date(), 0, false, 0, ""));
    newGroup$ = this.newGroupSource.asObservable();

    public hubConnection: HubConnection = this.hubService.getGroupConnection() || this.hubService.ConnectionGroupHub(this.dataService.getToken(), this.personId);

    error: string = "";
    private errorSource = new BehaviorSubject<string>("");
    error$ = this.errorSource.asObservable();

    async errorSubscribe() {
        await this.hubConnection.on("Error", (error: string) => {
            this.error = error;
            this.errorSource.next(this.error);
        })
    }
    async subscribeNotification() {
        await this.hubConnection.on('Notification', (groupName, message: string) => {
            this.groupNameSource.next(groupName);
            this.notificationSource.next(message);
            console.log('уведомление: ', groupName, message);
        })
    }
    
    async createGroup(name: string) {
        await this.hubConnection.invoke('CreateGroup', new GroupRequest(name, this.personId))
            .then(() => console.log('Группа создана'))
            .catch(error => console.error('Ошибка при создании группы:', error));
    }

    async subscribeNewGroup() {
        await this.hubConnection.on('NewGroup', (group: Dialog) => {
            this.newGroupSource.next(group);
            console.log('новая группа:', group);
        });
    }

    async joinPersonToGroup(groupId: number, memberId: number) {
        await this.hubConnection.invoke('AddPersonToGroup', new MemberRequest(groupId, memberId, this.personId))
            .then(() => console.log("Пользователь добавлен в группу"))
            .catch(error => console.error('Ошибка при добавлении к группе:', error, 'Dto: ', groupId, memberId, this.personId));
    }

    async subscribeJoinPersonToGroup() {
        await this.hubConnection.on('PersonAdded', (message: GroupMessage) => {
            console.log(message)
        })
    }

    async sendGroupMessage(groupId: number, message: string) {
        await this.hubConnection.invoke('SaveGroupMessage', new GroupMessageRequest(groupId, this.personId, message))
            .then(() => console.log('Сообщение отправлено'))
            .catch(error => console.error(`Ошибка при отправке группового сообщения от ${this.personId}:`, error));
    }
    async subscribeNewGroupMessages() {
        await this.hubConnection.on('NewGroupMessage', (message: GroupMessage) => {
            console.log('новое групповое сообщение:', message);
            const currentDate = new Date();
            const existingGroup = this.groupMessages.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
            if (existingGroup) {
                existingGroup.messages.push(message);
            }
            else {
                this.groupMessages.push(new GroupedMessagesInGroup(message.sentAt, new Array<GroupMessage>(message)))
                this.groupMessagesSource.next(this.groupMessages)
            }
        });
    }

    async getGroupMessages(groupId: number) {
        await this.hubConnection.invoke("GetAllGroupMessages", groupId, 0)
            .catch(err => console.error(err));
    }

    async subscribeGroupMessages() {
        await this.hubConnection.on("AllGroupMessages", (messages: GroupedMessagesInGroup[]) => {
            this.groupMessages = messages;
            this.groupMessagesSource.next(this.groupMessages);
            console.log('Загружены сообщения группы:', messages);
        });
    }

    async getGroupMembers(groupId: number) {
        await this.hubConnection.invoke("GetAllMembersInGroup", groupId)
            .catch(err => console.log(err));
    }

    async subscribeGroupMembers() {
        await this.hubConnection.on("AllMembers", (members: MemberResponse) => {
            this.membersSource.next(members);
            console.log("Загружены участники группы: ", members);
        })
    }

    async subscribeUsers() {
        await this.hubConnection.on('AllUsersToAddGroup', (users: PersonResponse[]) => {
            this.usersSource.next(users);
            console.log('список пользователей для добавления в группу', users);
        })
    }

    async getUsers(groupId: number) {
        await this.hubConnection.invoke('GetAllUsersToAddGroup', groupId, this.personId)
            .catch(err => console.log(err));
    }

    async ChangeStatusIncomingMessages(groupId: number, groupName: string) {
        await this.hubConnection.invoke('ChangeStatusIncomingMessagesAsync', groupId, groupName)
        .catch(err => console.log(err));
    }

    async subscribeMessagesWithNewStatus() {
        await this.hubConnection.on('MessagesWithNewStatus', (groupedMessages: GroupedMessagesInGroup[]) => {
            const currentDate = new Date();
            groupedMessages.forEach(element => {
                element.messages.forEach(message => {
                    const existingGroup = this.groupMessages.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
                    if (existingGroup) {
                        existingGroup.messages = existingGroup.messages.filter(msg => msg.isCheck !== false);
                        existingGroup.messages.push(message);
                    }
                    console.log('групповое сообщение, отмеченное прочитанным:', message);
                })
            });

        })
    }

    async LeaveGroup(request: LeaveGroupRequest) {
        await this.hubConnection.invoke('LeaveGroupAsync', request)
        .catch(err => console.log(err));
    }

    async ReturnToGroup(groupId: number, groupName: string, personLogin: string) {
        await this.hubConnection.invoke('ReturnToGroupAsync', groupId, groupName, this.personId, personLogin)
        .catch(err => console.log(err));
    }

    async subscribePersonStatus() {
        await this.hubConnection.on('memberStatus', (status: boolean) => {
            this.statusSource.next(status);
            console.log('статус пользователя', status);
        })
    }
}