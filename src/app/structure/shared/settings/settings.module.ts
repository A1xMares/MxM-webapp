import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SETTINGS_ROUTES} from './settings.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {SettingsComponent} from './settings.component';
import {MaterialModule} from '../../../material/material.module';



@NgModule({
  declarations: [
      SettingsComponent
  ],
  imports: [
      SETTINGS_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule
  ]
})
export class SettingsModule { }
