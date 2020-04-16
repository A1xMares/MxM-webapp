import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DASH_ROUTES} from './dashboard.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {DashboardComponent} from './dashboard.component';
import {UltimateSelectModule} from '../../../generic-components/filters/ultimate-select/ultimate-select.module';
import {ChartsModule} from 'ng2-charts';
import {QRCodeModule} from "angularx-qrcode";
import {CarouselModule} from "ngx-owl-carousel-o";



@NgModule({
  declarations: [
      DashboardComponent
  ],
  imports: [
      DASH_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,

      UltimateSelectModule,

      ChartsModule,
      QRCodeModule,
      CarouselModule
  ]
})
export class DashboardModule { }
