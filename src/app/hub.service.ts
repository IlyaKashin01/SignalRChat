import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { DataService } from './data.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HubService {
    constructor(private dataService: DataService) { }
    private hubConnection: HubConnection = new HubConnectionBuilder()
        .withUrl(`https://localhost:7130/chat?access_token=${this.dataService.getToken()}`)
        .build();
    private promiseStart: Promise<void> | undefined;
    Connection() {
        this.promiseStart = this.hubConnection.start()
            .then(() => console.log('Подключение к хабу установлено'))
            .catch(err => console.error('Ошибка подключения к хабу SignalR:', err,));
        return this.hubConnection;
    }
    getPromiseSrart() { return this.promiseStart; }
    getConnection() { return this.hubConnection; }
    async Invoke(nameMethod: string, params: any, nameError: string, nameLog: string) {
        await this.hubConnection.invoke(nameMethod, params)
            .then(() => console.log(nameLog))
            .catch(error => console.error(nameError, error));
    }
}