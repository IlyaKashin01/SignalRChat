import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { GroupComponent } from './group.component';

@NgModule({
    imports: [CommonModule, BrowserModule],
    declarations: [
        GroupComponent
    ],
    providers: [],
    bootstrap: [GroupComponent]
})
export class GroupModule { }
