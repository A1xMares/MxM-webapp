import { Injectable, OnDestroy} from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { map, takeUntil} from 'rxjs/operators';
import { Router} from '@angular/router';
import {ApiService} from '../api/api.service';
import * as SecureLS from 'secure-ls';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //
  private url = 'https://api.mxm-web.com.mx/api/';

  private onDestroy = new Subject<void>();


  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public userObservable: Observable<any> = this.currentUserSubject.asObservable();

  public currentUser: Observable<any>;
  public firstLoad = true;

  public socketAuthored = false;

  // ------------------- //
  // Service constructor //
  // ------------------- //
  constructor(
      private http: HttpClient,
      private router: Router,
      private apiService: ApiService,
      // private socket: Socket
  ) {

    /* listener to save user on localStorage every time it changes */
    this.currentUserSubject.pipe(takeUntil(this.onDestroy)).subscribe((changedUser) => {

      /*if (this.socket) {
        this.socket.fromEvent<any>('connect').pipe(takeUntil(this.onDestroy)).subscribe(() => {
          // console.log('authenticating from connect listener');
          if (changedUser.id && changedUser.userId) {
            this.socket.emit('authentication', {id: changedUser.id, userId: changedUser.userId });
            this.socket.fromEvent<any>('authenticated').pipe(takeUntil(this.onDestroy)).subscribe(() => {
              // console.log('socket authenticated');
            });
          }
        });
      }*/

      if (changedUser && !this.firstLoad) {
        ls.set('LH52NZe7Av', changedUser);
      }
    });

    /* get user from localStorage */
    const ls = new SecureLS({
      encodingType: 'aes'
    });
    const user = ls.get('LH52NZe7Av');

    /* 1.- next of found user 2.- logout */
    if (user) {
      this.currentUserSubject.next(user);
      this.firstLoad = false;
    }

  }

  // ---------------- //
  // Update user data //
  // ---------------- //
  public updateUserData() {

    let userObject = this.currentUserValue;
    this.apiService.getDataObject('AppUsers', userObject.user.id).pipe(takeUntil(this.onDestroy)).subscribe((updatedUser) => {
      if (JSON.stringify( userObject.user) !== JSON.stringify(updatedUser)) {
        userObject.user = updatedUser;
        this.currentUserSubject.next(userObject);
      }
    });
  }

  // ------------------------ //
  // Get value of logged user //
  // ------------------------ //
  public get currentUserValue(): any {
    return this.currentUserSubject.getValue();
  }

  // --------------------- //
  // Perform login request //
  // --------------------- //
  login(credentials: any) {
    return new Observable(obj => this.http.post(this.url + 'AppUsers/login?include=user', credentials).subscribe((user: any) => {
      if (user && user.id) {
        const ls = new SecureLS({
          encodingType: 'aes'
        });
        ls.set('LH52NZe7Av', user);
        this.currentUserSubject.next(user);
        obj.next(user);
      }
    }, () => {
      obj.next(false);
    }));
  }

  // ---------------------- //
  // Perform logout request //
  // ---------------------- //
  logout(req: boolean) {

    /*if (this.socket) {
      this.socket.emit('disconnect');
    }*/

    if (req) {
      this.http.post<any>(
          this.url + 'AppUsers/logout',
          '',
      ).pipe(takeUntil(this.onDestroy)).subscribe(() => {
        this.cleanSession();
      }, () => {
        this.cleanSession();
      });
    } else {
      this.cleanSession();
    }
  }

  // ------------------ //
  // Clean localForage //
  // ------------------ //
  cleanSession() {
    const ls = new SecureLS({
      encodingType: 'aes'
    });
    ls.clear();

    this.currentUserSubject.next(false);
    this.router.navigate(['/login']).catch();
  }

  // ------------------ //
  // useRemoteMethod    //
  // ------------------ //
  useRemoteMethod(model: string, method: string, params: object){
    let body = {
      ...params
    };
    return this.http.post(this.url + model + '/' + method, body);
  }

  // ------------------ //
  // useRemoteMethod    //
  // ------------------ //
  useRemoteMethodWithToken(model: string, method: string, params: object, token: string){
    let body = {
      ...params
    };
    return this.http.post(this.url + model + '/' + method, body, {headers: new HttpHeaders({Authorization: token}) });
  }


  // -------------------- //
  // On destroy lifecycle //
  // -------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
