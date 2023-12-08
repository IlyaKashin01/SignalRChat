import { Component } from '@angular/core';
import { AuthService } from './http.service';
import { AuthRequest, AuthResponse, OperationResult } from './authDto';
import { NavigationExtras, Router } from '@angular/router';
import { DataService } from '../data.service';
import { HubService } from '../hub.service';

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
    constructor(private authService: AuthService, private router: Router, private tokenService: DataService, private hubService: HubService) { }

    onKeyLogin(event: any) {
        this.username = event.target.value;
    }
    onKeyPass(event: any) {
        this.password = event.target.value;
    }
    async login() {
        this.authService.signInRequest(new AuthRequest(this.username, this.password)).subscribe({
            next: async (data: OperationResult<AuthResponse>) => {
                if (data.result) {
                    this.done = true;
                    await this.tokenService.setToken(data.result.token);
                    await this.tokenService.setPerson(data.result.person);
                    if (await this.hubService.Connection(`https://localhost:7130/chat?access_token=${data.result.token}`, 'chat', data.result.person.id))
                        this.router.navigate(['/chat']);
                }
                else
                    console.log(data.message, data.errorCode, data.stackTrace);
            },
            error: error => console.log(error)
        });
    }
}
