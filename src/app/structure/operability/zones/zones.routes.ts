import {RouterModule, Routes} from '@angular/router';
import {ZonesComponent} from './zones.component';
import {ZonesTableComponent} from './zones-table/zones-table.component';
import {SelectedZoneComponent} from './selected-zone/selected-zone.component';

const routes: Routes = [
    {
        path: '', component: ZonesComponent,
        children: [
            {
                path: '',
                component: ZonesTableComponent
            },
            {
                path: ':id',
                component: SelectedZoneComponent
            }
        ]
    }
];

export const ZONES_ROUTES = RouterModule.forChild(routes);
