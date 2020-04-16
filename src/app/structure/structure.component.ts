import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, OnDestroy,
  OnInit,
  ViewChildren
} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../services/auth/auth.service';
import {ActivatedRoute, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {QueryFactory} from '../tableQueries/queryFactory';
import {CustomDataSource} from '../tableQueries/customDataSource';
import {ApiService} from '../services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import {takeUntil} from 'rxjs/operators';
import { timeout } from 'q';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit, AfterViewInit, OnDestroy {

  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //
  @ViewChildren('snav') snav;

  private onDestroy = new Subject<void>();
  public currentUser: any = false;

  public userRole = '';

  public firstLoad = false;
  public loading = false;

  private mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  public isOperability = false;
  public isReports = false;
  public isConfig = false;
  public isClients = false;

  // --------------------- //
  // Component constructor //
  // --------------------- //
  constructor(
      private authService: AuthService,
      private route: ActivatedRoute,
      private apiService: ApiService,
      public dialog: MatDialog,
      private router: Router,
      public queryFactory: QueryFactory,
      private activatedRoute: ActivatedRoute,
      public changeDetectorRef: ChangeDetectorRef,
      public media: MediaMatcher,
  ) {
    this.authService.userObservable.pipe(takeUntil(this.onDestroy)).subscribe((data) => {
      this.currentUser = data ? data : false;
    });

    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  // ---------------------- //
  // OnInit view init cycle //
  // ---------------------- //
  ngOnInit() {
    this.setHeightListener();

    const url = this.router.url;
    this.checkUrl(url);

    this.authService.userObservable.pipe(takeUntil(this.onDestroy)).subscribe((user) => {
      if (user) {
      }
    });
  }

  checkUrl(url: string) {
    this.isOperability = false;
    this.isConfig = false;
    this.isClients = false;

    if (
      url.indexOf('sucursal') !== -1 ||
      url.indexOf('zonas') !== -1 ||
      url.indexOf('rutas') !== -1 ||
      url.indexOf('asesores') !== -1
    ) {
      this.isOperability = true;
    } else if (
      url.indexOf('perfil') !== -1 ||
      url.indexOf('usuarios') !== -1 ||
      url.indexOf('configuraciion') !== -1
    ) {
      this.isConfig = true;
    } else if (
      url.indexOf('clientes') !== -1 ||
      url.indexOf('prestamos') !== -1
    ) {
      this.isClients = true;
    }
  }

  setHeightListener() {
    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }

  // --------------------- //
  // After view init cycle //
  // --------------------- //
  ngAfterViewInit(): void {
    this.authService.updateUserData();
  }

  // --------------------- //
  // Logout click function //
  // --------------------- //
  logout() {
    this.authService.logout(false);
  }

  navigateDash() {
    this.router.navigate(['inicio']).catch();
  }

  // -------------------------- //
  // Go to client from dropdown //
  // -------------------------- //
  goToClient(client) {
    this.router.navigate(['clients/', client.id ]).catch();
  }

  // -------------------- //
  // Search for clients   //
  // -------------------- //
  findClients(dataSearch: string) {

  }

  // -------------------- //
  // On destroy lifecycle //
  // -------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
