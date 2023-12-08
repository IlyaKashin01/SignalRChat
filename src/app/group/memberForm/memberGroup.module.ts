import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberFormComponent } from './memberGroup.component';

@NgModule({
    declarations: [
        MemberFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        MemberFormComponent
    ]
})
export class MemberFormModule { }
