import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "../data.service";
import { BehaviorSubject, } from "rxjs";
import { GetMessagesRequest, Message, SendMessageRequest } from "./Dto";
import { HubService } from "../hub.service";
import { PersonResponse } from "../signin/authDto";

@Injectable()
export class ChatService {
    constructor(private dataService: DataService, private hubService: HubService) { }
    private personalMessages: Message[] = [];
    private personalMessagesSource = new BehaviorSubject<Message[]>([]);
    personalmessages$ = this.personalMessagesSource.asObservable();
    private message: Message = new Message(0, 0, "", new Date, false);
    private messageSource = new BehaviorSubject<Message>(new Message(0, 0, "", new Date, false));
    message$ = this.messageSource.asObservable();
    private personId: number = this.dataService.getPersonId();
    private hubConnection: HubConnection = this.hubService.Connection();
    dialogs: PersonResponse[] = [];
    private dialogsSourse = new BehaviorSubject<PersonResponse[]>([]);
    dialogs$ = this.dialogsSourse.asObservable();

    async getConnection() { return await this.hubService.getPromiseSrart(); }
    async sendMessage(message: string, recipientId: number) {
        await this.hubService.Invoke(
            'SendPersonalMessage',
            new SendMessageRequest(this.personId, recipientId, message, false),
            `Ошибка при отправке сообщения от ${this.personId}:`,
            'сообщение отправлено'
        );
    }
    async subscribeNewPersonalMessages() {
        this.hubConnection.on('NewMessage', (message: Message) => {
            this.message = message;
            this.messageSource.next(this.message);
            this.personalMessages.push(this.message)
            this.personalMessagesSource.next(this.personalMessages)
            console.log('новое сообщение:', message);
        });
    }
    async getAllPersonalMessages(recipientId: number) {
        await this.hubService.Invoke(
            "GetAllPersonalMessages",
            new GetMessagesRequest(this.personId, recipientId),
            `Ошибка при получении сообщений между ${this.personId} и ${recipientId}`,
            `Загружен диалог между ${this.personId} и ${recipientId}`
        )
    }
    async subscribeAllPersonalMessages() {
        await this.hubConnection.on("AllPersonalMessageInDialog", (messages: Message[]) => {
            this.personalMessages = messages;
            this.personalMessagesSource.next(this.personalMessages);
            console.log('сообщения из бд:', messages);
        });
    }
    async subscribeDialogs() {
        await this.hubConnection.on('AllDialogs', (dialogs: PersonResponse[]) => {
            this.dialogs = dialogs;
            this.dialogsSourse.next(this.dialogs);
            console.log('диалоги из бд:', this.dialogs);
        });
    }
    async getDialogs() {
        await this.hubService.Invoke(
            'GetAllPersonalDialogs',
            this.dataService.getPersonId(),
            'dialogs does not exist',
            'получен список диалогов'
        )
    }
}