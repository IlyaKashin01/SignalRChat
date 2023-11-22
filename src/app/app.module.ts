import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInModule } from './signin/signin.module';
import { ChatModule } from './chat/chat.module';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { ChatService } from './chat/chat.service';
import { GroupModule } from './group/group.module';
import { HubService } from './hub.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SignInModule,
    ChatModule,
    GroupModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [DataService, ChatService, HubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
