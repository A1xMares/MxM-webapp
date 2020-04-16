import {RouterModule, Routes} from '@angular/router';
import {ClientsComponent} from './clients.component';
import {ClientsTableComponent} from './clients-table/clients-table.component';
import {SelectedClientComponent} from './selected-client/selected-client.component';

const routes: Routes = [
    {
        path: '', component: ClientsComponent,
        children: [
            {
                path: '',
                component: ClientsTableComponent
            },
            {
                path: ':id',
                component: SelectedClientComponent
            }
        ]
    }
];

export const CLIENTS_ROUTES = RouterModule.forChild(routes);
