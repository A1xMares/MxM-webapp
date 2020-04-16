import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RangeFilterComponent} from './range-filter.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  declarations: [
    RangeFilterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  exports: [
    RangeFilterComponent
  ],
  entryComponents: [
    RangeFilterComponent
  ]
})
export class RangeFilterModule { }
