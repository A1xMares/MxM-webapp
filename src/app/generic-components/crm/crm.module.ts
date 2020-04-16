import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CrmTableComponent} from './crm-table/crm-table.component';
import {MaterialModule} from '../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {UltimateSelectModule} from '../filters/ultimate-select/ultimate-select.module';
import {ModalConfirmModule} from '../../modals/desicion-modals/modal-confirm/modal-confirm.module';
import {TagsFilterModule} from '../filters/tags-filter/tags-filter.module';
import {RangeFilterModule} from '../filters/range-filter/range-filter.module';
import {DataTableModule} from '../data-visualization/data-table/data-table.module';
import {GoogleMapRangeModule} from '../filters/google-map-range/google-map-range.module';



@NgModule({
  declarations: [
    CrmTableComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,

    UltimateSelectModule,
    ModalConfirmModule,
    TagsFilterModule,
    RangeFilterModule,
    DataTableModule,
    GoogleMapRangeModule
  ],
  exports: [
    CrmTableComponent
  ]
})
export class CrmModule { }
