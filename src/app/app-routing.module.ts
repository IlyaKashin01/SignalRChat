import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './signin/signin.component';
import { ChatComponent } from './chat/chat.component';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'group', component: GroupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
