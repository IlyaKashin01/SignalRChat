import { Component, OnInit } from '@angular/core';
import { AuthService } from './http.service';
import { AuthRequest, AuthResponse } from './authDto';
import { Router } from '@angular/router';
import { TokenService } from '../data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
    providers: [AuthService]
})
export class SignInComponent {
    username: string = "";
    password: string = "";
    done: boolean = false;
    constructor(private authService: AuthService, private router: Router, private tokenService: TokenService) { }

    onKeyLogin(event: any) {
        this.username = event.target.value;
    }
    onKeyPass(event: any) {
        this.password = event.target.value;
    }
    login() {
        this.authService.signInRequest(new AuthRequest(this.username, this.password)).subscribe({
            next: (data: any) => {
                this.done = true;
                this.tokenService.setToken(data.result.token);
                this.tokenService.setPersonId(data.result.person.id)
                this.router.navigate(['/chat'])
            },
            error: error => console.log(error)
        });
    }
}