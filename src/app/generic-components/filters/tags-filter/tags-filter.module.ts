import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TagsFilterComponent} from './tags-filter.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  declarations: [
    TagsFilterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  exports: [
    TagsFilterComponent
  ],
  entryComponents: [
    TagsFilterComponent
  ]
})
export class TagsFilterModule { }
