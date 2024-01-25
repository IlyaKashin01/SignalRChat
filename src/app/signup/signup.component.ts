import { Component } from '@angular/core';
import { AuthService } from '../common/services/http.service';
import { Router } from '@angular/router';
import { DataService } from '../common/services/data.service';
import { HubService } from '../common/services/hub.service';
import { AuthRequest, AuthResponse, OperationResult, SignUpRequest } from '../common/DTO/authDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'signin',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [AuthService]
})
export class SignUpComponent {
    registrationForm: FormGroup;

    constructor(private authService: AuthService, private router: Router, private tokenService: DataService, private hubService: HubService, private formBuilder: FormBuilder) { 
        this.registrationForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[\d!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/)]],
            confirmPassword: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
          }, { validators: this.passwordMatchValidator });
    }
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')!.value;
        const confirmPassword = form.get('confirmPassword')!.value;

        return password === confirmPassword ? null : { mismatch: true };
    }
    async signup(form: FormGroup) {
        if (this.registrationForm.valid){
            console.log("Регистрационные данные:", this.registrationForm.value);
            this.authService.signUpRequest(new SignUpRequest(form.get('username')!.value, form.get('email')!.value, form.get('password')!.value)).subscribe({
                next: async (data: OperationResult<number>) => {
                    if (data.result && data.success) {
                        await this.login(form);
                    }
                    else
                        console.log(data.message, data.errorCode, data.stackTrace);
                },
                error: error => console.log(error)
            });
        }
        else{
            console.log("Форма содержит ошибки. Детали:");
            for (const controlName in this.registrationForm.controls) {
                if (this.registrationForm.controls.hasOwnProperty(controlName)) {
                    const control = this.registrationForm.get(controlName);
                    console.log(`${controlName}:`, control?.errors);
                }
            }
            this.registrationForm.markAllAsTouched();
        }
    }

    private async login(form: FormGroup) {
        this.authService.signInRequest(new AuthRequest(form.get('username')!.value, form.get('password')!.value)).subscribe({
            next: async (data: OperationResult<AuthResponse>) => {
                if (data.result && data.success) {
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

    goToSignIn() {
        this.router.navigate(['']);
    }
}
