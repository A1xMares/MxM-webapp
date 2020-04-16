import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResetPasswordComponent} from './reset-password.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {ModalConfirmModule} from '../../desicion-modals/modal-confirm/modal-confirm.module';

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    ModalConfirmModule
  ],
  exports: [
    ResetPasswordComponent
  ],
  entryComponents: [
    ResetPasswordComponent
  ]
})
export class ResetPasswordModule { }
