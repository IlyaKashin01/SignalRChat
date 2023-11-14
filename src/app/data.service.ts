import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
    private tokenSubject = new BehaviorSubject<string>('');
    private personIdSubject = new BehaviorSubject<number>(0);
    public recipientIdSubject = new BehaviorSubject<number>(0);
    setToken(token: string) {
        this.tokenSubject.next(token);
    }
    getToken() {
        return this.tokenSubject.getValue();
    }
    setPersonId(personId: number) {
        this.personIdSubject.next(personId);
    }
    getPersonId() {
        return this.personIdSubject.getValue();
    }
    setRecipientId(recipientId: number) {
        this.recipientIdSubject.next(recipientId);
    }
    getRecipientId() {
        return this.recipientIdSubject.getValue();
    }
}