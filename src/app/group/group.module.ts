import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { GroupComponent } from './group.component';
import { FormsModule } from '@angular/forms';
import { MemberFormModule } from './memberForm/memberGroup.module';

@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule, MemberFormModule],
    declarations: [
        GroupComponent
    ],
    providers: [],
    bootstrap: [GroupComponent],
    exports: [GroupComponent],
})
export class GroupModule { }
