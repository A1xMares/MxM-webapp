import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent
    }
];

export const DASH_ROUTES = RouterModule.forChild(routes);
