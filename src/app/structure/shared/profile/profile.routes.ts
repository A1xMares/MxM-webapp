import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from "./profile.component";

const routes: Routes = [
    {
        path: '', component: ProfileComponent
    }
];

export const PROFILE_ROUTES = RouterModule.forChild(routes);
