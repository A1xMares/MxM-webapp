import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ROUTES_ROUTES} from './routes.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {ModalConfirmModule} from '../../../modals/desicion-modals/modal-confirm/modal-confirm.module';

import {DataTableModule} from '../../../generic-components/data-visualization/data-table/data-table.module';
import { RoutesComponent } from './routes.component';
import { RoutesTableComponent } from './routes-table/routes-table.component';
import { SelectedRouteComponent } from './selected-route/selected-route.component';



@NgModule({
  declarations: [
  RoutesComponent,
  RoutesTableComponent,
  SelectedRouteComponent],
  imports: [
    ROUTES_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,


      ModalConfirmModule,
      DataTableModule,
  ]
})
export class RoutesModule { }
