import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PROFILE_ROUTES} from './profile.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {ProfileComponent} from './profile.component';
import {MaterialModule} from '../../../material/material.module';

@NgModule({
  declarations: [
      ProfileComponent
  ],
  imports: [
      PROFILE_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule
  ]
})
export class ProfileModule { }
