import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { TokenService } from '../data.service';
import * as signalR from '@aspnet/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatService } from './chat.service';
import { Message } from './messageDto';

@Component({
    selector: 'signin',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    inputValue: string = "";
    messages: any;
    personalMessages: Message[] = [];
    groupMessages: string[] = [];

    constructor(private chatHub: ChatService,) {
    }
    onKey(event: any) {
        this.inputValue = event.target.value;
    }

    ngOnInit(): void {
        this.chatHub.connect();
        this.chatHub.getMessages();
        this.chatHub.getAllPersonalMessages();
        this.chatHub.getAllPersonalMessagesInvoke();
        this.chatHub.messages$.subscribe(messages => {
            this.messages = messages;
        });
        this.chatHub.personalmessages$.subscribe((messages: Message[]) => {
            this.personalMessages = messages;
        });
    }

    sendMessage(message: string) { this.chatHub.sendMessage(message); this.chatHub.getAllPersonalMessagesInvoke(); }

}