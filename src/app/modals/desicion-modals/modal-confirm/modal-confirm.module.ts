import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalConfirmComponent} from './modal-confirm.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  declarations: [
    ModalConfirmComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  exports: [
    ModalConfirmComponent
  ],
  entryComponents: [
    ModalConfirmComponent
  ]
})
export class ModalConfirmModule { }
