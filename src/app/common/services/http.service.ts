import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse, OperationResult, SignUpRequest } from '../DTO/authDto';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) { }

    signInRequest(requestBody: AuthRequest): Observable<OperationResult<AuthResponse>> {
        return this.http.post<OperationResult<AuthResponse>>('https://localhost:7130/api/auth/signin', requestBody);
    }

    signUpRequest(requestBody: SignUpRequest): Observable<OperationResult<number>> {
        return this.http.post<OperationResult<number>>('https://localhost:7130/api/auth/signup', requestBody);
    }
}