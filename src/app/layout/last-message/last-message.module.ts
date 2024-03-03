import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastMessageComponent } from './last-message.component';



@NgModule({
  declarations: [LastMessageComponent],
  imports: [
    CommonModule
  ],
  bootstrap: [LastMessageComponent],
  exports: [LastMessageComponent]
})
export class LastMessageModule { }
