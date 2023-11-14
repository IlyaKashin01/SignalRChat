import { NgModule } from '@angular/core';
import { SignInComponent } from './signin.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        SignInComponent
    ],
    imports: [CommonModule],
    bootstrap: [SignInComponent]
})
export class SignInModule { }
