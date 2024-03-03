import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "./data.service";
import { BehaviorSubject, elementAt, } from "rxjs";
import { GetMessagesRequest, GroupedMessages, Message, SendMessageRequest } from "../DTO/chatDto";
import { Dialog, LastMessage, Notification } from "../DTO/commonDto";
import { HubService } from "./hub.service";
import { PersonResponse } from "../DTO/authDto";

@Injectable()
export class ChatService {
    constructor(private dataService: DataService, private hubService: HubService) { }

    private personalMessages: GroupedMessages[] = [];
    private personalMessagesSource = new BehaviorSubject<GroupedMessages[]>([]);
    personalmessages$ = this.personalMessagesSource.asObservable();

    private usersSource = new BehaviorSubject<PersonResponse[]>([]);
    users$ = this.usersSource.asObservable();

    private personId: number = this.dataService.getPerson().id;
    private hubConnection: HubConnection = this.hubService.getChatConnection() || this.hubService.ConnectionChatHub(this.dataService.getToken(), this.personId);

    private dialogsSourse = new BehaviorSubject<Dialog[]>([]);
    dialogs$ = this.dialogsSourse.asObservable();

    private dialogSourse = new BehaviorSubject<Dialog>(new Dialog(0,"","",false,new Date(),0,"",false,0,""));
    dialog$ = this.dialogSourse.asObservable();

    private onlineMarkersSourse = new BehaviorSubject<number[]>([]);
    onlineMarkers$ = this.onlineMarkersSourse.asObservable();

    private notificationSource = new BehaviorSubject<Notification>(new Notification("", ""));
    notification$ = this.notificationSource.asObservable();

    private lastMessages: LastMessage[] = [];
    private lastMessagesSource = new BehaviorSubject<LastMessage[]>([]);
    lastMessages$ = this.lastMessagesSource.asObservable();

    private errorSource = new BehaviorSubject<string>('');
    error$ = this.errorSource.asObservable();

    async errorSubscribe() {
        await this.hubConnection.on("Error", (error: string) => {
            this.errorSource.next(error);
        })
    }

    async getOnlineMarkers() {
        await this.hubConnection.invoke('GetOnlineMarkers')
            .then(() => console.log('получены отметки Online'))
            .catch(error => console.log(error));
    }

    async subscribeNotification() {
        await this.hubConnection.on('Notification', (name, message: string) => {
            this.notificationSource.next(new Notification(name, message));
            console.log('уведомление: ', name, message);
        })
    }

    async subscribeOnlineMarkers() {
        this.hubConnection.on('OnlineMarkers', (markers: number[]) => {
            this.onlineMarkersSourse.next(markers);
        })
    }
    async sendMessage(message: string, recipientId: number, isNewDialog: boolean) {
        await this.hubConnection.invoke('SendPersonalMessage', new SendMessageRequest(this.personId, recipientId, message, isNewDialog))
            .then(() => console.log('сообщение отправлено'))
            .catch(error => console.error(`Ошибка при отправке сообщения от ${this.personId}:`, error));
    }
    async subscribeNewPersonalMessages() {
        this.hubConnection.on('NewMessage', (message: Message) => {
            const currentDate = new Date();
            const existingGroup = this.personalMessagesSource.value.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
            if (existingGroup) {
                existingGroup.messages.push(message);
            }
            else {
                this.personalMessages.push(new GroupedMessages(message.sentAt, new Array<Message>(message)))
                this.personalMessagesSource.next(this.personalMessages)
            }
            this.lastMessages.push(new LastMessage(message.recipientId, message.content, message.isCheck, message.sentAt, message.senderLogin));
            this.lastMessages.push(new LastMessage(message.senderId, message.content, message.isCheck, message.sentAt, message.senderLogin));
            this.lastMessagesSource.next(this.lastMessages);
            console.log('новое сообщение:', message);
        });
    }
    async getAllPersonalMessages(recipientId: number) {
        await this.hubConnection.invoke("GetAllPersonalMessages", new GetMessagesRequest(this.personId, recipientId))
            .then(() => console.log(`Загружен диалог между ${this.personId} и ${recipientId}`))
            .catch(error => console.error(`Ошибка при получении сообщений между ${this.personId} и ${recipientId}`, error));
    }
    async subscribeAllPersonalMessages() {
        await this.hubConnection.on("AllPersonalMessageInDialog", (messages: GroupedMessages[]) => {
            this.personalMessages = messages;
            this.personalMessagesSource.next(messages);
            console.log('сообщения из бд:', messages);
        });
    }
    async subscribeDialogs() {
        await this.hubConnection.on('AllDialogs', (dialogs: Dialog[]) => {
            this.dialogsSourse.next(dialogs);
            console.log('диалоги из бд:', dialogs);
        });
    }
    async getDialogs() {
        await this.hubConnection.invoke('GetAllDialogs', this.personId)
            .then(() => console.log('получен список диалогов'))
            .catch(error => console.error('диалоги не найдены', error));
    }
    async subscribeNewDialog() {
        await this.hubConnection.on('NewDialog', (dialog: Dialog) => {
            this.dialogSourse.next(dialog);
            console.log('новый диалог: ', dialog);
        })
    }
    async subscribeUsers() {
        await this.hubConnection.on('AllUsers', (users: PersonResponse[]) => {
            this.usersSource.next(users);
            console.log('список доступных пользователей', users);
        })
    }

    async getUsers() {
        await this.hubConnection.invoke('GetAllUsers', this.personId)
            .catch(err => console.log(err));
    }

    async ChangeStatusIncomingMessages(recipientId: number) {
        await this.hubConnection.invoke('ChangeStatusIncomingMessagesAsync', recipientId, this.personId)
    }

    async subscribeMessagesWithNewStatus() {
        await this.hubConnection.on('MessagesWithNewStatus', (groupedMessages: GroupedMessages[]) => {
            const currentDate = new Date();
            groupedMessages.forEach(element => {
                const existingGroup = this.personalMessagesSource.value.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
                    if (existingGroup) {
                        existingGroup.messages = existingGroup.messages.map(message => {
                            const newElement = element.messages.find(x => x.id === message.id);
                            return newElement ? newElement : message;
                        })
                        console.log('сообщения, отмеченные прочитанными:', element.messages);
                    }
            });

        })
    }
}