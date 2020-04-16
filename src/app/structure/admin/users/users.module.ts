import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {USERS_ROUTES} from './users.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {UsersComponent} from './users.component';
import {ModalConfirmModule} from '../../../modals/desicion-modals/modal-confirm/modal-confirm.module';

import {DataTableModule} from '../../../generic-components/data-visualization/data-table/data-table.module';
import { UsersTableComponent } from './users-table/users-table.component';
import { SelectedUserComponent } from './selected-user/selected-user.component';
import {ResetPasswordModule} from '../../../modals/crud-modals/reset-password/reset-password.module';



@NgModule({
  declarations: [
      UsersComponent,
      UsersTableComponent,
      SelectedUserComponent
  ],
  imports: [
      USERS_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,

      ResetPasswordModule,
      ModalConfirmModule,
      DataTableModule,
  ]
})
export class UsersModule { }
