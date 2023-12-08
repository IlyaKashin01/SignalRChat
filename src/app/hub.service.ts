import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HubService {
    constructor() { }
    private hubConnection: HubConnection | undefined;
    private promiseStart: Promise<void> | undefined;
    private markers: number[] = [];
    public OnlineMarkers = new BehaviorSubject<number[]>([]);
    Connection(url: string, hubName: string, id: number) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(url)
            .build();
        this.promiseStart = this.hubConnection.start()
            .then(() => console.log(`Подключение к ${hubName} хабу установлено`))
            .catch(err => console.error(`Ошибка подключения к ${hubName} хабу:`, err,));
        if (this.markers.indexOf(id) === 0) {
            this.markers.push(id);
            this.OnlineMarkers.next(this.markers);
        }
        return this.hubConnection;
    }
    getConnection() { return this.hubConnection; }
    getPromiseSrart() { return this.promiseStart; }

}