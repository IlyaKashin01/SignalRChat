import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [CommonModule, BrowserModule],
    declarations: [
        ChatComponent
    ],
    providers: [],
    bootstrap: [ChatComponent]
})
export class ChatModule { }
