import { Injectable } from "@angular/core";
import { HubConnection, } from "@aspnet/signalr";
import { DataService } from "./data.service";
import { BehaviorSubject, elementAt, } from "rxjs";
import { Dialog, GetMessagesRequest, GroupedMessages, Message, SendMessageRequest } from "../chat/Dto";
import { HubService } from "./hub.service";
import { PersonResponse } from "../signin/authDto";

@Injectable()
export class ChatService {
    constructor(private dataService: DataService, private hubService: HubService) { }

    private personalMessages: GroupedMessages[] = [];
    private personalMessagesSource = new BehaviorSubject<GroupedMessages[]>([]);
    personalmessages$ = this.personalMessagesSource.asObservable();

    private messageSource = new BehaviorSubject<Message>(new Message(0, 0, "", 0, "", new Date, false));
    message$ = this.messageSource.asObservable();

    private usersSource = new BehaviorSubject<PersonResponse[]>([]);
    users$ = this.usersSource.asObservable();

    private personId: number = this.dataService.getPerson().id;
    private hubConnection: HubConnection = this.hubService.getChatConnection() || this.hubService.ConnectionChatHub(this.dataService.getToken(), this.personId);

    dialogs: Dialog[] = [];
    private dialogsSourse = new BehaviorSubject<Dialog[]>([]);
    dialogs$ = this.dialogsSourse.asObservable();

    private onlineMarkersSourse = new BehaviorSubject<number[]>([]);
    onlineMarkers$ = this.onlineMarkersSourse.asObservable();

    private nameDialogSource = new BehaviorSubject<string>('');
    nameDialog$ = this.nameDialogSource.asObservable();

    private notificationSource = new BehaviorSubject<string>('');
    notification$ = this.notificationSource.asObservable();

    error: string = '';
    private errorSource = new BehaviorSubject<string>('');
    error$ = this.errorSource.asObservable();

    async errorSubscribe() {
        await this.hubConnection.on("Error", (error: string) => {
            this.error = error;
            this.errorSource.next(this.error);
        })
    }

    async getOnlineMarkers() {
        await this.hubConnection.invoke('GetOnlineMarkers')
            .then(() => console.log('получены отметки Online'))
            .catch(error => console.log(error));
    }

    async subscribeNotification() {
        await this.hubConnection.on('Notification', (name, message: string) => {
            this.nameDialogSource.next(name);
            this.notificationSource.next(message);
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
            this.messageSource.next(message);
            const currentDate = new Date();
            const existingGroup = this.personalMessages.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
            if (existingGroup) {
                existingGroup.messages.push(message);
            }
            else {
                this.personalMessages.push(new GroupedMessages(message.sentAt, new Array<Message>(message)))
                this.personalMessagesSource.next(this.personalMessages)
            }
            const existingDialog = this.dialogs.find(X => X.id === message.recipientId);
            if (existingDialog) {
                existingDialog.lastMessage = message.content;
                existingDialog.dateTime = message.sentAt;
                existingDialog.isCheck = message.isCheck;
            }
            this.dialogsSourse.next(this.dialogs);
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
        await this.hubConnection.invoke('GetAllDialogs', this.personId)
            .then(() => console.log('получен список диалогов'))
            .catch(error => console.error('диалоги не найдены', error));
    }
    async subscribeNewDialog() {
        await this.hubConnection.on('AllDialogs', (dialog: Dialog) => {
            this.dialogs.push(dialog)
            this.dialogsSourse.next(this.dialogs)
            console.log('новый диалог: ', dialog);
        })
    }
    async subscribeUsers() {
        await this.hubConnection.on('AllUsers', (users: PersonResponse[]) => {
            this.usersSource.next(users);
            console.log('список пользователей', users);
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
                element.messages.forEach(message => {
                    const existingGroup = this.personalMessages.find(group => new Date(group.sentAt).toDateString() === currentDate.toDateString());
                    if (existingGroup) {
                        existingGroup.messages = existingGroup.messages.filter(msg => msg.isCheck !== false);
                        existingGroup.messages.push(message);
                    }
                    console.log('новое сообщение:', message);
                })
            });

        })
    }
}