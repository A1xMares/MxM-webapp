import {RouterModule, Routes} from '@angular/router';
import {BranchesComponent} from './branches.component';
import {BranchesTableComponent} from './branches-table/branches-table.component';
import {SelectedBranchComponent} from './selected-branch/selected-branch.component';

const routes: Routes = [
    {
        path: '', component: BranchesComponent,
        children: [
            {
                path: '',
                component: BranchesTableComponent
            },
            {
                path: ':id',
                component: SelectedBranchComponent
            }
        ]
    }
];

export const BRANCHES_ROUTES = RouterModule.forChild(routes);
