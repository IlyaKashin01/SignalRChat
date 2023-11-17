import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "../data.service";
import { BehaviorSubject, } from "rxjs";
import { GroupMessage, GroupMessageDto, GroupedMessagesInGroup, MemberRequest } from "./Dto";
import { GroupRequest } from "./Dto";
import { HubService } from "../hub.service";

@Injectable()
export class GroupService {
    constructor(private dataService: DataService, private hubService: HubService) { }

    private groupMessages: GroupedMessagesInGroup[] = [];
    private groupMessagesSource = new BehaviorSubject<GroupedMessagesInGroup[]>([]);
    groupmessages$ = this.groupMessagesSource.asObservable();

    private message: GroupMessage = new GroupMessage(0, 0, "", new Date,);
    private messageSource = new BehaviorSubject<GroupMessage>(new GroupMessage(0, 0, "", new Date,));
    message$ = this.messageSource.asObservable();

    token: string = "";
    personId: number = this.dataService.getPersonId();
    groupId: number = this.dataService.getGroupId();
    private hubConnection: HubConnection = this.hubService.getConnection();

    error: string = "";
    private errorSource = new BehaviorSubject<string>("");
    error$ = this.errorSource.asObservable();

    async errorSubscribe() {
        await this.hubConnection.on("Error", (error: string) => {
            this.error = error;
            this.errorSource.next(this.error);
        })
    }

    async createGroup(name: string) {
        await this.hubConnection.invoke('CreateGroup', new GroupRequest(name, this.personId))
            .then(() => console.log('Группа создана'))
            .catch(error => console.error('Ошибка при создании группы:', error));
    }

    async joinPersonToGroup(memberId: number) {
        await this.hubConnection.invoke('AddPersonToGroup', new MemberRequest(this.groupId, memberId, this.personId))
            .then(() => console.log("Пользователь добавлен в группу"))
            .catch(error => console.error('Ошибка при добавлении к группе:', error));
    }

    async sendGroupMessage(message: string) {
        await this.hubConnection.invoke('SaveGroupMessage', new GroupMessageDto(this.groupId, this.personId, message))
            .then(() => console.log('Сообщение отправлено'))
            .catch(error => console.error(`Ошибка при отправке сообщения от ${this.personId}:`, error));
    }
    async subscribeNewGroupMessages() {
        this.hubConnection.on('NewGroupMessage', (message: GroupMessage) => {
            this.message = message;
            this.messageSource.next(this.message);
            const currentDate = new Date();
            const existingGroup = this.groupMessages.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
            if (existingGroup) {
                existingGroup.messages.push(message);
            }
            else {
                this.groupMessages.push(new GroupedMessagesInGroup(message.sentAt, new Array<GroupMessage>(message)))
                this.groupMessagesSource.next(this.groupMessages)
            }
            console.log('новое сообщение:', message);
        });
    }

    async getGroupMessages() {
        await this.hubConnection.invoke("GetAllGroupMessages", this.groupId)
            .catch(err => console.error(err));
    }
    async subscribeGroupMessages() {
        await this.hubConnection.on("AllGroupMessages", (messages: GroupedMessagesInGroup[]) => {
            this.groupMessages = messages;
            this.groupMessagesSource.next(this.groupMessages);
            console.log('Загружены сообщения группы:', messages);
        });
    }
}