import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { TokenService } from "../data.service";
import { HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { PersonResponse } from "../signin/authDto";
import { Message } from "./messageDto";

@Injectable()
export class ChatService {
    constructor(private tokenService: TokenService) { }
    private messages: string[] = [];
    private personalMessages: Message[] = [];
    private personalMessagesSource = new BehaviorSubject<Message[]>([]);
    personalmessages$ = this.personalMessagesSource.asObservable();
    private messageSource = new BehaviorSubject<string[]>([]);
    messages$ = this.messageSource.asObservable();
    groupMessages: string[] = [];
    token: string = "";
    personId: number = this.tokenService.getPersonId()
    private hubConnection: HubConnection = new HubConnectionBuilder()
        .withUrl(`https://localhost:7130/chat?access_token=${this.tokenService.getToken()}`)
        .build();
    connect() {
        console.log(this.tokenService.getToken())
        this.hubConnection.start()
            .then(() => console.log('Подключение к хабу SignalR успешно установлено'))
            .catch(err => console.error('Ошибка подключения к хабу SignalR:', err,));
    }
    async sendMessage(message: string) {
        await this.hubConnection.invoke('SendPersonalMessage', this.personId, 2, message)
            .then(() => console.log('Сообщение отправлено'))
            .catch(error => console.error(`Ошибка при отправке сообщения от ${this.personId}:`, error));
    }
    getAllPersonalMessagesInvoke() {
        this.hubConnection.invoke("GetAllPersonalMessages", 1, 2)
            .catch(err => console.error(err));
    }
    getAllPersonalMessages() {

        this.hubConnection.on("AllPersonalMessageInDialog", (messages: Message[]) => {
            this.personalMessages = messages;
            this.personalMessagesSource.next(this.personalMessages);
            console.log('получено сообщений из бд:', messages);
        });
    }
    joinGroup(name: string) {
        this.hubConnection.invoke('JoinGroup', name)
            .then(() => console.log('Пользователь добавлен в группу'))
            .catch(error => console.error('Ошибка при добавлении к группе:', error));
    }
    getMessages() {
        this.hubConnection.on("PersonalMessage", (message) => {
            this.messages.push(message);
            this.messageSource.next(this.messages);
            console.log('Получено новое сообщение из SignalR:', message);
        });
    }
    getList() { return this.messageSource.getValue() }
    // showAllPersonalMessages() {
    //     this.getAllPersonalMessages();
    //     this.hubConnection.on("AllPersonalMessageInDialog", (message) => {
    //         this.messages.push(message);
    //         console.log('Получено новое сообщение из SignalR:', message);
    //     });
    // }
    getGroupMessages() {
        this.hubConnection.on("ReceiveMessage", (message) => {
            this.groupMessages.push(message);
            console.log('Получено новое сообщение из SignalR:', message);
        });
    }
}