import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LOANS_ROUTES} from './loans.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {ModalConfirmModule} from '../../../modals/desicion-modals/modal-confirm/modal-confirm.module';

import {DataTableModule} from '../../../generic-components/data-visualization/data-table/data-table.module';
import { LoansComponent } from './loans.component';
import { LoansTableComponent } from './loans-table/loans-table.component';
import { SelectedLoanComponent } from './selected-loan/selected-loan.component';



@NgModule({
  declarations: [
  LoansComponent,
  LoansTableComponent,
  SelectedLoanComponent],
  imports: [
    LOANS_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,


      ModalConfirmModule,
      DataTableModule,
  ]
})
export class LoansModule { }
