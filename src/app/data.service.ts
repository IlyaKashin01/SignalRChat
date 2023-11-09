import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonResponse } from './signin/authDto';

@Injectable({ providedIn: 'root' })
export class TokenService {
    private tokenSubject = new BehaviorSubject<string>('');
    setToken(token: string) {
        this.tokenSubject.next(token);
    }
    getToken() {
        return this.tokenSubject.getValue();
    }
    private personIdSubject = new BehaviorSubject<number>(0);
    setPersonId(personId: number) {
        this.personIdSubject.next(personId);
    }
    getPersonId() {
        return this.personIdSubject.getValue();
    }
}