import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ADVISORES_ROUTES} from './advisores.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {ModalConfirmModule} from '../../../modals/desicion-modals/modal-confirm/modal-confirm.module';

import {DataTableModule} from '../../../generic-components/data-visualization/data-table/data-table.module';
import { AdvisoresComponent } from './advisores.component';
import { AdvisoresTableComponent } from './advisores-table/advisores-table.component';
import { SelectedAdvisorComponent } from './selected-advisor/selected-advisor.component';



@NgModule({
  declarations: [
  AdvisoresComponent,
  AdvisoresTableComponent,
  SelectedAdvisorComponent],
  imports: [
    ADVISORES_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,


      ModalConfirmModule,
      DataTableModule,
  ]
})
export class AdvisoresModule { }
