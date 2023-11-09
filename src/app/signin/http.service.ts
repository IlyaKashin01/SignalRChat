import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from './authDto';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) { }

    signInRequest(requestBody: AuthRequest) {
        return this.http.post('https://localhost:7130/api/auth/signin', requestBody);
    }
}