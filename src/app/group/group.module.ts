import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { GroupComponent } from './group.component';
import { FormsModule } from '@angular/forms';
import { MemberFormModule } from './memberForm/memberGroup.module';
import { NotificationModule } from "../notification/notification.module";
import { GroupWingowModule } from "./groupInfoWindow/groupWindow.module";
import { NgIconsModule } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';

@NgModule({
    declarations: [
        GroupComponent
    ],
    providers: [],
    bootstrap: [GroupComponent],
    exports: [GroupComponent],
    imports: [CommonModule, BrowserModule, FormsModule, MemberFormModule, NotificationModule, GroupWingowModule, NgIconsModule.withIcons({ featherAirplay, heroUsers })]
})
export class GroupModule { }
