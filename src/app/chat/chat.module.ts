import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { GroupModule } from '../group/group.module';
import { UserFormModule } from './form/dialogForm.module';

@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule, AppRoutingModule, GroupModule, UserFormModule],
    declarations: [
        ChatComponent
    ],
    providers: [],
    bootstrap: [ChatComponent]
})
export class ChatModule { }
