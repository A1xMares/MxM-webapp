import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalThreeButtonsComponent} from './modal-three-buttons.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  declarations: [
    ModalThreeButtonsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  exports: [
    ModalThreeButtonsComponent
  ],
  entryComponents: [
    ModalThreeButtonsComponent
  ]
})
export class ModalThreeButtonsModule { }
