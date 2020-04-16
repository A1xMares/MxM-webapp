import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLoaderComponent } from './data-loader/data-loader.component';
import { TableLoaderComponent } from './table-loader/table-loader.component';
import {MaterialModule} from '../../material/material.module';

@NgModule({
  declarations: [
    DataLoaderComponent,
    TableLoaderComponent
  ],
  imports: [
    CommonModule,
      MaterialModule
  ],
  exports: [
    DataLoaderComponent,
    TableLoaderComponent
  ],
  entryComponents: [
    DataLoaderComponent,
    TableLoaderComponent
  ]
})
export class LoadersModule { }
