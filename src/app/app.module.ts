import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInModule } from './signin/signin.module';
import { ChatModule } from './chat/chat.module';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from './data.service';
import { ChatService } from './chat/chat.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SignInModule,
    ChatModule,
    HttpClientModule,
  ],
  providers: [TokenService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
