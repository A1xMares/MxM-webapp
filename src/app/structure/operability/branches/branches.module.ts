import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BRANCHES_ROUTES} from './branches.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {ModalConfirmModule} from '../../../modals/desicion-modals/modal-confirm/modal-confirm.module';

import {DataTableModule} from '../../../generic-components/data-visualization/data-table/data-table.module';
import { BranchesComponent } from './branches.component';
import { BranchesTableComponent } from './branches-table/branches-table.component';
import { SelectedBranchComponent } from './selected-branch/selected-branch.component';



@NgModule({
  declarations: [
  BranchesComponent,
  BranchesTableComponent,
  SelectedBranchComponent],
  imports: [
    BRANCHES_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,


      ModalConfirmModule,
      DataTableModule,
  ]
})
export class BranchesModule { }
