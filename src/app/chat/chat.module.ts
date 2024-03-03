import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { GroupModule } from '../group/group.module';
import { UserFormModule } from './form/dialogForm.module';
import { GroupFormModule } from '../group/groupForm/createGroup.module';
import { NotificationModule } from "../notification/notification.module";
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [
        ChatComponent
    ],
    providers: [],
    bootstrap: [ChatComponent],
    imports: [
        CommonModule, 
        BrowserModule, 
        FormsModule, 
        AppRoutingModule, 
        GroupModule, 
        UserFormModule, 
        GroupFormModule, 
        NotificationModule,
        MatIconModule
    ],
    exports: [ChatComponent]
})
export class ChatModule { }
