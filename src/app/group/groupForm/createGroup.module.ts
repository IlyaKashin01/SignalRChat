import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupFormComponent } from './createGroup.component';

@NgModule({
    declarations: [
        GroupFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        GroupFormComponent
    ]
})
export class GroupFormModule { }
