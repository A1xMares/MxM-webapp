import {RouterModule, Routes} from '@angular/router';
import {AdvisoresComponent} from './advisores.component';
import {AdvisoresTableComponent} from './advisores-table/advisores-table.component';
import {SelectedAdvisorComponent} from './selected-advisor/selected-advisor.component';

const routes: Routes = [
    {
        path: '', component: AdvisoresComponent,
        children: [
            {
                path: '',
                component: AdvisoresTableComponent
            },
            {
                path: ':id',
                component: SelectedAdvisorComponent
            }
        ]
    }
];

export const ADVISORES_ROUTES = RouterModule.forChild(routes);
