import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInModule } from './signin/signin.module';
import { ChatModule } from './chat/chat.module';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './common/services/data.service';
import { ChatService } from './common/services/chat.service';
import { GroupModule } from './group/group.module';
import { HubService } from './common/services/hub.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationModule } from './notification/notification.module';
import { SignUpModule } from './signup/signup.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SignInModule,
    SignUpModule,
    ChatModule,
    GroupModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NotificationModule
  ],
  providers: [DataService, ChatService, HubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
