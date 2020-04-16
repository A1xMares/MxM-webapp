import {RouterModule, Routes} from '@angular/router';
import {LoansComponent} from './loans.component';
import {LoansTableComponent} from './loans-table/loans-table.component';
import {SelectedLoanComponent} from './selected-loan/selected-loan.component';

const routes: Routes = [
    {
        path: '', component: LoansComponent,
        children: [
            {
                path: '',
                component: LoansTableComponent
            },
            {
                path: ':id',
                component: SelectedLoanComponent
            }
        ]
    }
];

export const LOANS_ROUTES = RouterModule.forChild(routes);
