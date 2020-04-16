import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CLIENTS_ROUTES} from './clients.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {ModalConfirmModule} from '../../../modals/desicion-modals/modal-confirm/modal-confirm.module';

import {DataTableModule} from '../../../generic-components/data-visualization/data-table/data-table.module';
import { ClientsComponent } from './clients.component';
import { ClientsTableComponent } from './clients-table/clients-table.component';
import { SelectedClientComponent } from './selected-client/selected-client.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {ChartsModule} from 'ng2-charts';
import { LoansHistoryComponent } from './selected-client/loans-history/loans-history.component';
import { ClientStatusComponent } from './selected-client/client-status/client-status.component';
import { VisitsHistoryComponent } from './selected-client/visits-history/visits-history.component';
import { ClientRouteComponent } from './selected-client/client-route/client-route.component';



@NgModule({
  declarations: [
  ClientsComponent,
  ClientsTableComponent,
  SelectedClientComponent,
  LoansHistoryComponent,
  ClientStatusComponent,
  VisitsHistoryComponent,
  ClientRouteComponent],
  imports: [
    CLIENTS_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,


      ModalConfirmModule,
      DataTableModule,
    LeafletModule,
    ChartsModule,
  ]
})
export class ClientsModule { }
