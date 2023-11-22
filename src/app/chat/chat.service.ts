import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "../data.service";
import { BehaviorSubject, } from "rxjs";
import { Dialog, GetMessagesRequest, GroupedMessages, Message, SendMessageRequest } from "./Dto";
import { HubService } from "../hub.service";
import { PersonResponse } from "../signin/authDto";

@Injectable()
export class ChatService {
    constructor(private dataService: DataService, private hubService: HubService) { }

    private personalMessages: GroupedMessages[] = [];
    private personalMessagesSource = new BehaviorSubject<GroupedMessages[]>([]);
    personalmessages$ = this.personalMessagesSource.asObservable();

    private message: Message = new Message(0, 0, "", new Date, false);
    private messageSource = new BehaviorSubject<Message>(new Message(0, 0, "", new Date, false));
    message$ = this.messageSource.asObservable();

    private users: PersonResponse[] = [];
    private usersSource = new BehaviorSubject<PersonResponse[]>([]);
    users$ = this.usersSource.asObservable();

    private personId: number = this.dataService.getPersonId();
    private hubConnection: HubConnection = this.hubService.Connection();

    dialogs: Dialog[] = [];
    private dialogsSourse = new BehaviorSubject<Dialog[]>([]);
    dialogs$ = this.dialogsSourse.asObservable();

    error: string = "";
    private errorSource = new BehaviorSubject<string>("");
    error$ = this.errorSource.asObservable();

    async errorSubscribe() {
        await this.hubConnection.on("Error", (error: string) => {
            this.error = error;
            this.errorSource.next(this.error);
        })
    }

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
            const currentDate = new Date();
            const existingGroup = this.personalMessages.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
            if (existingGroup) {
                existingGroup.messages.push(message)
            }
            else {
                this.personalMessages.push(new GroupedMessages(message.sentAt, new Array<Message>(message)))
                this.personalMessagesSource.next(this.personalMessages)
            }
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
        await this.hubConnection.on("AllPersonalMessageInDialog", (messages: GroupedMessages[]) => {
            this.personalMessages = messages;
            this.personalMessagesSource.next(this.personalMessages);
            console.log('сообщения из бд:', messages);
        });
    }
    async subscribeDialogs() {
        await this.hubConnection.on('AllDialogs', (dialogs: Dialog[]) => {
            this.dialogs = dialogs;
            this.dialogsSourse.next(this.dialogs);
            console.log('диалоги из бд:', this.dialogs);
        });
    }
    async getDialogs() {
        await this.hubService.Invoke(
            'GetAllDialogs',
            this.dataService.getPersonId(),
            'dialogs does not exist',
            'получен список диалогов'
        )
    }

    async subscribeUsers() {
        await this.hubConnection.on('AllUsers', (users: PersonResponse[]) => {
            this.users = users;
            this.usersSource.next(this.users);
            console.log('список пользователей', users);
        })
    }

    async getUsers() {
        await this.hubConnection.invoke('GetAllUsers', this.personId)
            .catch(err => console.log(err));
    }
}