import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupWindowComponent } from './groupWindow.component';
import { NgIconsModule } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [
        GroupWindowComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgIconsModule.withIcons({ featherAirplay, heroUsers }),
        MatIconModule
    ],
    exports: [
        GroupWindowComponent
    ]
})
export class GroupWingowModule { }
