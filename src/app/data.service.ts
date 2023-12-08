import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonResponse } from './signin/authDto';

@Injectable({ providedIn: 'root' })
export class DataService {
    private tokenSubject = new BehaviorSubject<string>('');
    private personSubject = new BehaviorSubject<PersonResponse>(new PersonResponse(0, "", ""));
    private groupIdSubject = new BehaviorSubject<number>(0);
    public recipientIdSubject = new BehaviorSubject<number>(0);
    setToken(token: string) {
        this.tokenSubject.next(token);
    }
    getToken() {
        return this.tokenSubject.getValue();
    }
    setPerson(person: PersonResponse) {
        this.personSubject.next(person);
    }
    getPerson() {
        return this.personSubject.getValue();
    }
    setRecipientId(recipientId: number) {
        this.recipientIdSubject.next(recipientId);
    }
    getRecipientId() {
        return this.recipientIdSubject.getValue();
    }
    setGroupId(groupId: number) {
        this.groupIdSubject.next(groupId);
    }
    getGroupId() {
        return this.groupIdSubject.getValue();
    }
}