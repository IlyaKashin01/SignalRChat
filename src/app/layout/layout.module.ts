import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgIconsModule } from "@ng-icons/core";
import { featherAirplay } from "@ng-icons/feather-icons";
import { heroUsers } from "@ng-icons/heroicons/outline";
import { NotificationModule } from "../notification/notification.module";
import { UserFormModule } from "../chat/form/dialogForm.module";
import { GroupFormModule } from "../group/groupForm/createGroup.module";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { LastMessageModule } from "./last-message/last-message.module";

@NgModule({
    declarations: [
        LayoutComponent,
    ],
    providers: [],
    bootstrap: [LayoutComponent],
    exports: [LayoutComponent],
    imports: [
        CommonModule, 
        BrowserModule, 
        FormsModule, 
        NotificationModule, 
        NgIconsModule.withIcons({ featherAirplay, heroUsers }), 
        UserFormModule, 
        GroupFormModule,
        MatIconModule,
        RouterModule,
        LastMessageModule
    ]
})
export class LayoutModule { }