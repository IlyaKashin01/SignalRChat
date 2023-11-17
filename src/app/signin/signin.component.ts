import { Component } from '@angular/core';
import { AuthService } from './http.service';
import { AuthRequest } from './authDto';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

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
    constructor(private authService: AuthService, private router: Router, private tokenService: DataService,) { }

    onKeyLogin(event: any) {
        this.username = event.target.value;
    }
    onKeyPass(event: any) {
        this.password = event.target.value;
    }
    async login() {
        this.authService.signInRequest(new AuthRequest(this.username, this.password)).subscribe({
            next: async (data: any) => {
                this.done = true;
                await this.tokenService.setToken(data.result.token);
                await this.tokenService.setPersonId(data.result.person.id);
                this.router.navigate(['/chat']);
            },
            error: error => console.log(error)
        });
    }
}
