import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UltimateSelectComponent} from './ultimate-select.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    UltimateSelectComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  exports: [
    UltimateSelectComponent
  ],
  entryComponents: [
    UltimateSelectComponent
  ]
})
export class UltimateSelectModule { }
