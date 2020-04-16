import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Observable} from "rxjs";
import * as SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
    ) { }

    canActivate(): boolean {

        const ls = new SecureLS({
            encodingType: 'aes'
        });
        const user = ls.get('LH52NZe7Av');

        if (user) {
            return true;
        } else {
            console.log('failed session guard');
            this.router.navigate(['login']).then(() => {
                return false;
            });
        }
        // this.router.navigate(['login']).then(() => {
        //     return false;
        // });
    }
}
