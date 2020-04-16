import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {UsersTableComponent} from './users-table/users-table.component';
import {SelectedUserComponent} from './selected-user/selected-user.component';

const routes: Routes = [
    {
        path: '', component: UsersComponent,
        children: [
            {
                path: '',
                component: UsersTableComponent
            },
            {
                path: ':id',
                component: SelectedUserComponent
            }
        ]
    }
];

export const USERS_ROUTES = RouterModule.forChild(routes);
