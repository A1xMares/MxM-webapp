import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ZONES_ROUTES} from './zones.routes';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

import {ModalConfirmModule} from '../../../modals/desicion-modals/modal-confirm/modal-confirm.module';

import {DataTableModule} from '../../../generic-components/data-visualization/data-table/data-table.module';
import { ZonesComponent } from './zones.component';
import { ZonesTableComponent } from './zones-table/zones-table.component';
import { SelectedZoneComponent } from './selected-zone/selected-zone.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {ChartsModule} from 'ng2-charts';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import { ZoneRoutesComponent } from './selected-zone/zone-routes/zone-routes.component';
import { ZoneAsvisersComponent } from './selected-zone/zone-asvisers/zone-asvisers.component';
import { ZoneClientsComponent } from './selected-zone/zone-clients/zone-clients.component';
import { ZoneDataComponent } from './selected-zone/zone-data/zone-data.component';

@NgModule({
  declarations: [
  ZonesComponent,
  ZonesTableComponent,
  SelectedZoneComponent,
  ZoneRoutesComponent,
  ZoneAsvisersComponent,
  ZoneClientsComponent,
  ZoneDataComponent],
  imports: [
    ZONES_ROUTES,
      CommonModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      NgxMaskModule,


      ModalConfirmModule,
      DataTableModule,
    LeafletModule,
    LeafletDrawModule,
    ChartsModule,
  ]
})
export class ZonesModule { }
