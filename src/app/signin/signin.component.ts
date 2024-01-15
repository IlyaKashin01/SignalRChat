import { Component } from '@angular/core';
import { AuthService } from '../common/http.service';
import { AuthRequest, AuthResponse, OperationResult } from './authDto';
import { NavigationExtras, Router } from '@angular/router';
import { DataService } from '../common/data.service';
import { HubService } from '../common/hub.service';
import { GroupService } from '../common/group.service';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
    providers: [AuthService]
})
export class SignInComponent {
    username: string = "";
    password: string = "";
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
                    await this.tokenService.setToken(data.result.token);
                    await this.tokenService.setPerson(data.result.person);
                    if (await this.hubService.ConnectionChatHub(data.result.token, data.result.person.id)
                        && await this.hubService.ConnectionGroupHub(data.result.token, data.result.person.id)) {
                        this.router.navigate(['/chat']);
                    }
                }
                else
                    console.log(data.message, data.errorCode, data.stackTrace);
            },
            error: error => console.log(error)
        });
    }
}
