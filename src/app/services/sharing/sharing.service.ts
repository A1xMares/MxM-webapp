import {AfterViewInit, Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class SharingService {
  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //
  private onDestroy = new Subject<void>();

  public serviceData: BehaviorSubject<any> = new BehaviorSubject(false);

  public serviceDataObservable: Observable<any> = this.serviceData.asObservable();

  public newClientSearch: BehaviorSubject<any>;
  public groupData: any = null;
  public plantData: any = null;
  public clientsScroll: number = 0;

  public goToDealsFromDash: string = '';

  public rootRole: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor() {
    // console.log('setting clientSearch');
    this.newClientSearch = new BehaviorSubject(JSON.parse(localStorage.getItem('clientSearch')));
    // console.log('init sharing observable');
    this.newClientSearch.asObservable().pipe(takeUntil(this.onDestroy)).subscribe((clientSearch) => {
      // console.log('clientSearch changed', clientSearch);
      if (clientSearch) {
        localStorage.setItem('clientSearch', JSON.stringify(clientSearch));
      } else {
        if (localStorage.getItem('clientSearch')) {
          localStorage.removeItem('clientSearch');
        }
      }
    });
  }

  // --------------------- //
  // ON DESTROY LIFE CYCLE //
  // --------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
