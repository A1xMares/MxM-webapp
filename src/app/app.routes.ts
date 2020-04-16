import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import {SessionGuard} from './services/guards/session.guard';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },
    {
        path: '',
        canActivate: [ SessionGuard ],
        loadChildren: () => import('./structure/structure.module').then(m => m.StructureModule)
    },
    {
        path: '**',
        redirectTo: 'inicio',
    }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes);
