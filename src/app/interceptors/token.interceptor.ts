import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth/auth.service';
import * as SecureLS from 'secure-ls';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const ls = new SecureLS({
            encodingType: 'aes'
        });
        const currentUser = ls.get('LH52NZe7Av');
        const isLogin = request.url.includes('login');
        if (currentUser && currentUser.id && !isLogin) {
            request = request.clone({
                setHeaders: {
                    Authorization: ('Bearer ' + currentUser.token)
                }
            });
        }
        return next.handle(request);
    }
}
