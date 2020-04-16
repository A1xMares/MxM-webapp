import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessageModalComponent} from "./message-modal.component";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskModule} from "ngx-mask";

@NgModule({
  declarations: [
    MessageModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  exports: [
    MessageModalComponent
  ],
  entryComponents: [
    MessageModalComponent
  ]
})
export class MessageModalModule { }
