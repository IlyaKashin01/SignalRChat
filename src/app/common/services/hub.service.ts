import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HubService {
    constructor() { }
    private chatHubConnection: HubConnection | undefined;
    private groupHubConnection: HubConnection | undefined;
    private chatPromiseStart: Promise<void> | undefined;
    private groupPromiseStart: Promise<void> | undefined;
    private markers: number[] = [];
    public OnlineMarkers = new BehaviorSubject<number[]>([]);
    
    ConnectionChatHub(token: string, id: number) {
        this.chatHubConnection = new HubConnectionBuilder()
            .withUrl(`https://localhost:7130/chat?access_token=${token}`)
            .build();

        this.chatPromiseStart = this.chatHubConnection.start()
            .then(() => console.log(`Подключение к ChatHub установлено`))
            .catch(err => console.error(`Ошибка подключения к ChatHub:`, err,));

        if (this.markers.indexOf(id) === 0) {
            this.markers.push(id);
            this.OnlineMarkers.next(this.markers);
        }

        return this.chatHubConnection;
    }

    ConnectionGroupHub(token: string, id: number) {
        this.groupHubConnection = new HubConnectionBuilder()
            .withUrl(`https://localhost:7130/group?access_token=${token}`)
            .build();

        this.groupPromiseStart = this.groupHubConnection.start()
            .then(() => 
            {
                console.log(`Подключение к GroupHub установлено`); 
                this.onConnetionGroups(id);
            })
            .catch(err => console.error(`Ошибка подключения к GroupHub:`, err,));

        return this.groupHubConnection;
    }
    getChatConnection() { return this.chatHubConnection; }
    getGroupConnection() { return this.groupHubConnection; }
    getChatPromiseStart() { return this.chatPromiseStart; }
    getGroupPromiseStart() { return this.groupPromiseStart; }

    private async onConnetionGroups (id: number) {
        if(this.groupHubConnection)
        await this.groupHubConnection.invoke('OnConnectedGroupsAsync', id)
            .then(() => console.log('Пользователь подключен к группам'))
            .catch(error => console.error('Ошибка при подключении к группам:', error));
        else
            console.log(`Пользователь не был подключен к группам, т.к. ${this.groupHubConnection} undefined`);
    }
}