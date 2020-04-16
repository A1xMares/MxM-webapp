import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CancelModalComponent} from './cancel-modal.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  declarations: [
      CancelModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  exports: [
    CancelModalComponent
  ],
  entryComponents: [
    CancelModalComponent
  ]
})
export class CancelModalModule { }
