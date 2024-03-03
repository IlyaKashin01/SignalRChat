import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonResponse } from '../DTO/authDto';
import { GroupParams } from '../DTO/groupDto';

@Injectable({ providedIn: 'root' })
export class DataService {
    private tokenSubject = new BehaviorSubject<string>('');
    private personSubject = new BehaviorSubject<PersonResponse>(new PersonResponse(0, "", ""));
    private recipientIdSubject = new BehaviorSubject<number>(0);
    public recipientId$ = this.recipientIdSubject.asObservable();
    public dialogNameSubject = new BehaviorSubject<string>('');
    public dialogName$ = this.dialogNameSubject.asObservable();
    public groupParamsSubject = new BehaviorSubject<GroupParams>(new GroupParams("",0,0,"","",[]));
    public groupParams$ = this.groupParamsSubject.asObservable();
    private hideCounterKeySubject = new BehaviorSubject<number>(0);
    public hideCounterKey$ = this.hideCounterKeySubject.asObservable();
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
    setDialogName(name: string) {
        this.dialogNameSubject.next(name);
    }
    setGroupParams(params: GroupParams) {
        this.groupParamsSubject.next(params);
    }
    setHideCounterKey(key: number){
        this.hideCounterKeySubject.next(key);
    }
}