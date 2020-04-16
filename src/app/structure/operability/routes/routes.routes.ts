import {RouterModule, Routes} from '@angular/router';
import {RoutesComponent} from './routes.component';
import {RoutesTableComponent} from './routes-table/routes-table.component';
import {SelectedRouteComponent} from './selected-route/selected-route.component';

const routes: Routes = [
    {
        path: '', component: RoutesComponent,
        children: [
            {
                path: '',
                component: RoutesTableComponent
            },
            {
                path: ':id',
                component: SelectedRouteComponent
            }
        ]
    }
];

export const ROUTES_ROUTES = RouterModule.forChild(routes);
