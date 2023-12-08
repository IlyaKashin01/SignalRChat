import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "../data.service";
import { BehaviorSubject, } from "rxjs";
import { GroupMessage, GroupMessageDto, GroupedMessagesInGroup, MemberRequest, MemberResponse } from "./Dto";
import { GroupRequest } from "./Dto";
import { HubService } from "../hub.service";
import { PersonResponse } from "../signin/authDto";

@Injectable()
export class GroupService {
    constructor(private dataService: DataService, private hubService: HubService) { }

    private groupMessages: GroupedMessagesInGroup[] = [];
    private groupMessagesSource = new BehaviorSubject<GroupedMessagesInGroup[]>([]);
    groupmessages$ = this.groupMessagesSource.asObservable();

    private message: GroupMessage = new GroupMessage(0, 0, "", new Date,);
    private messageSource = new BehaviorSubject<GroupMessage>(new GroupMessage(0, 0, "", new Date,));
    message$ = this.messageSource.asObservable();

    private members: MemberResponse = new MemberResponse("", []);
    private membersSource = new BehaviorSubject<MemberResponse>(new MemberResponse("", []));
    members$ = this.membersSource.asObservable();

    private users: PersonResponse[] = [];
    private usersSource = new BehaviorSubject<PersonResponse[]>([]);
    users$ = this.usersSource.asObservable();

    token: string = "";
    personId: number = this.dataService.getPerson().id;
    groupId: number = this.dataService.getGroupId();
    private newGroupId: number = 0;
    private newGroupIdSource = new BehaviorSubject<number>(0);
    newGroupId$ = this.newGroupIdSource.asObservable();

    public hubConnection: HubConnection = this.hubService.getConnection() || this.hubService.Connection(`https://localhost:7130/chat?access_token=${this.dataService.getToken()}`, 'group', this.personId);

    error: string = "";
    private errorSource = new BehaviorSubject<string>("");
    error$ = this.errorSource.asObservable();

    async errorSubscribe() {
        await this.hubConnection.on("Error", (error: string) => {
            this.error = error;
            this.errorSource.next(this.error);
        })
    }
    async onConnectedGroup() {
        await this.hubConnection.invoke('OnConnectedGroupsAsync', this.personId)
            .then(() => console.log('пользователь подключен к группам'))
            .catch(error => console.error('Ошибка при создании группы:', error));
    }
    async createGroup(name: string) {
        await this.hubConnection.invoke('CreateGroup', new GroupRequest(name, this.personId))
            .then(() => console.log('Группа создана'))
            .catch(error => console.error('Ошибка при создании группы:', error));
    }

    async subscribeNewGroup() {
        await this.hubConnection.on('NewGroup', (key: number) => {
            this.newGroupId = key;
            this.newGroupIdSource.next(this.newGroupId);
            console.log('Id новой группы:', key);
        });
    }

    async joinPersonToGroup(groupId: number, memberId: number) {
        await this.hubConnection.invoke('AddPersonToGroup', new MemberRequest(groupId, memberId, this.personId))
            .then(() => console.log("Пользователь добавлен в группу"))
            .catch(error => console.error('Ошибка при добавлении к группе:', error));
    }

    async sendGroupMessage(groupId: number, message: string) {
        await this.hubConnection.invoke('SaveGroupMessage', new GroupMessageDto(groupId, this.personId, message))
            .then(() => console.log('Сообщение отправлено'))
            .catch(error => console.error(`Ошибка при отправке сообщения от ${this.personId}:`, error));
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
        await this.hubConnection.invoke("GetAllGroupMessages", groupId)
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
            console.log('список пользователей', users);
        })
    }

    async getUsers(groupId: number) {
        await this.hubConnection.invoke('GetAllUsersToAddGroup', groupId, this.personId)
            .catch(err => console.log(err));
        console.log(this.newGroupId)
    }
}