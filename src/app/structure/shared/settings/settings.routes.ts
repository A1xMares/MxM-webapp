import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings.component';

const routes: Routes = [
    {
        path: '', component: SettingsComponent
    }
];

export const SETTINGS_ROUTES = RouterModule.forChild(routes);
