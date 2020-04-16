import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTableComponent, SafeHtmlPipe} from './data-table.component';
import {MaterialModule} from '../../../material/material.module';
import {LoadersModule} from '../../loaders/loaders.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TagsDropdownComponent } from './dropdown-injectables/tags-dropdown/tags-dropdown.component';
import { RateDropdownComponent } from './dropdown-injectables/rate-dropdown/rate-dropdown.component';
import { LastNotesComponent } from './expandible-injectables/last-notes/last-notes.component';

@NgModule({
  declarations: [
    DataTableComponent,
    SafeHtmlPipe,
    TagsDropdownComponent,
    RateDropdownComponent,
    LastNotesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoadersModule,
    FormsModule,
      ReactiveFormsModule,
  ],
  exports: [
    DataTableComponent,
    TagsDropdownComponent,
    RateDropdownComponent
  ],
  entryComponents: [
    DataTableComponent,
  ]
})
export class DataTableModule { }
