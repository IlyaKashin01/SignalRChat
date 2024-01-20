import { NgModule } from '@angular/core';
import { SignUpComponent } from './signup.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
        SignUpComponent
    ],
    imports: [CommonModule, FormsModule, BrowserModule, ReactiveFormsModule],
    bootstrap: [SignUpComponent]
})
export class SignUpModule { }
