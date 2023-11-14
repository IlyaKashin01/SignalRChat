import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "../data.service";
import { BehaviorSubject, } from "rxjs";
import { GroupMessageDto, MemberRequest } from "./Dto";
import { GroupRequest } from "./Dto";
import { HubService } from "../hub.service";

@Injectable()
export class GroupService {
    constructor(private dataService: DataService, private hubService: HubService) { }
    private groupMessages: string[] = [];
    private groupMessagesSource = new BehaviorSubject<any[]>([]);
    groupmessages$ = this.groupMessagesSource.asObservable();
    token: string = "";
    personId: number = this.dataService.getPersonId()
    private hubConnection: HubConnection = this.hubService.Connection();
    async connect() {
        console.log(this.dataService.getToken())
        await this.hubConnection.start()
            .then(() => console.log('Подключение к хабу SignalR успешно установлено'))
            .catch(err => console.error('Ошибка подключения к хабу SignalR:', err,));
    }

    async createGroup(name: string) {
        await this.hubConnection.invoke('CreateGroup', new GroupRequest(name, this.personId))
            .then(() => console.log('Группа создана'))
            .catch(error => console.error('Ошибка при добавлении к группе:', error));
    }

    async joinPersonToGroup() {
        await this.hubConnection.invoke('AddPersonToGroup', new MemberRequest(1, 2))
            .then(() => console.log("Пользователь добавлен в группу"))
            .catch(error => console.error('Ошибка при добавлении к группе:', error));
    }

    async sendGroupMessage(message: string) {
        await this.hubConnection.invoke('SaveGroupMessage', new GroupMessageDto(1, this.personId, message))
            .then(() => console.log('Сообщение отправлено'))
            .catch(error => console.error(`Ошибка при отправке сообщения от ${this.personId}:`, error));
    }

    async getGroupMessages() {
        await this.hubConnection.invoke("GetAllGroupMessages", 1)
            .catch(err => console.error(err));
    }
    async subscribeGroupMessages() {
        await this.hubConnection.on("ReceiveMessage", (message) => {
            this.groupMessages.push(message);
            this.groupMessagesSource.next(this.groupMessages);
            console.log('Получено новое сообщение из SignalR:', message);
        });
    }
}