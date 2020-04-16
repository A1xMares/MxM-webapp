import { Routes, RouterModule } from '@angular/router';
import {StructureComponent} from './structure.component';

const routes: Routes = [
    {
        path: '', component: StructureComponent,
        children: [

            // ----------------------
            // SHARED
            // ----------------------
            {
                path: 'perfil',
                loadChildren: () => import('./shared/profile/profile.module').then(m => m.ProfileModule),
            },
            {
                path: 'configuracion',
                loadChildren: () => import('./shared/settings/settings.module').then(m => m.SettingsModule),
            },
            /*{
                path: 'calendario',
                loadChildren: () => import('./shared/calendar/calendar.module').then(m => m.CalendarAppModule),
            },*/
            {
                path: 'inicio',
                loadChildren: () => import('./shared/dashboard/dashboard.module').then(m => m.DashboardModule),
            },

          // ----------------------
          // OPERABILITY
          // ----------------------

          {
            path: 'clientes',
            loadChildren: () => import('./clients/clients/clients.module').then(m => m.ClientsModule),
          },

          {
            path: 'sucursales',
            loadChildren: () => import('./operability/branches/branches.module').then(m => m.BranchesModule),
          },

          {
            path: 'zonas',
            loadChildren: () => import('./operability/zones/zones.module').then(m => m.ZonesModule),
          },

          {
            path: 'rutas',
            loadChildren: () => import('./operability/routes/routes.module').then(m => m.RoutesModule),
          },

          {
            path: 'asesores',
            loadChildren: () => import('./operability/advisores/advisores.module').then(m => m.AdvisoresModule),
          },

          {
            path: 'prestamos',
            loadChildren: () => import('./clients/loans/loans.module').then(m => m.LoansModule),
          },

          // ----------------------
          // REPORTS
          // ----------------------

          /*{
            path: 'reportes',
            loadChildren: () => import('./reports/reports/reports.module').then(m => m.ReportsModule),
          },*/

            // ----------------------
            // ADMIN
            // ----------------------
            {
                path: 'usuarios',
                loadChildren: () => import('./admin/users/users.module').then(m => m.UsersModule),
            },
        ]
    }
];

export const STRUCTURE_ROUTES = RouterModule.forChild(routes);
