import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';

import {BehaviorSubject, Subject} from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormBuilder, FormControl} from '@angular/forms';
import {ApiService} from '../../../services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {QueryFactory} from '../../../tableQueries/queryFactory';
import {AuthService} from '../../../services/auth/auth.service';
import {Title} from '@angular/platform-browser';
import {
    fadeInBottom,
    fadeInTop
} from '../../../animations/animatedComponents';
import {ChartDataSets, ChartOptions, ChartType, RadialChartOptions} from 'chart.js';
import {Label, SingleDataSet} from 'ng2-charts';
import {takeUntil} from "rxjs/operators";



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [...fadeInTop, ...fadeInBottom]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  public currentUser: any = false;

  private onDestroy = new Subject<void>();
  public firstLoad = true;

  public jobsQty = 1258;
  public servicesQty = 93;

  owlConfig = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    navText: ['', ''],
    autoWidth: true,
    nav: true,
    autoplay: true,
    autoplayTimeout: 5000,
    items: 1
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] }
  };

  greenColor = {
    backgroundColor: 'rgba(86,185,57,.3)',
    borderColor: 'rgba(86,185,57,.7)',
    hoverBackgroundColor: 'rgba(86,185,57,.5)',
    hoverBorderColor: 'rgba(86,185,57,.7)',
    pointBackgroundColor: 'rgba(86,185,57,1)'
  };

  redColor = {
    backgroundColor: 'rgba(235,58,58,.3)',
    borderColor: 'rgba(235,58,58,.7)',
    hoverBackgroundColor: 'rgba(235,58,58,.5)',
    hoverBorderColor: 'rgba(235,58,58,.7)',
    pointBackgroundColor: 'rgba(235,58,58,1)'
  };

  yellowColor = {
    backgroundColor: 'rgba(254,181,62,.7)',
    borderColor: 'rgba(254,181,62,.9)',
    hoverBackgroundColor: 'rgba(254,181,62,1)',
    hoverBorderColor: 'rgba(254,181,62,1)'
  };

  blueColor = {
    backgroundColor: 'rgba(0,149,224,.7)',
    borderColor: 'rgba(0,149,224,.9)',
    hoverBackgroundColor: 'rgba(0,149,224,1)',
    hoverBorderColor: 'rgba(0,149,224,1)'
  };

  public barChartLabels: Label[] = ['Loma dorada', 'Centro', 'Camichines', 'Jardines', 'La providencia', 'Rosario', 'Jalisco'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {data: [17, 19, 12, 14, 15, 6, 18], label: 'PAGÓ', ...this.blueColor},
    { data: [1, 3, 2, 3, 6, 1, 0], label: 'NO PAGÓ', ...this.yellowColor }
  ];

  // RADAR

  public radarChartOptions: RadialChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public radarChartLabels: Label[] = ['Loma dorada', 'Centro', 'Camichines', 'Jardines', 'La providencia', 'Rosario', 'Jalisco'];

  public radarChartData: ChartDataSets[] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Al corriente', ...this.greenColor},
    { data: [12, 15, 35, 16, 20, 14, 28], label: 'Atrasados', ...this.redColor }
  ];
  public radarChartType: ChartType = 'radar';

  // PIES
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'top',
    },
  };
  public pieChartLabels: Label[] = ['Efectuadas', 'Pendientes'];
  public pieChartData: number[] = [105, 35];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = false;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)'],
    },
  ];


  // DOUGHNOUT

  public doughnutChartLabels: Label[] = ['No pagó', 'Cobrado', 'Pendiente'];
  public doughnutChartData: SingleDataSet = [4500, 13500, 2000];
  public doughnutChartType: ChartType = 'doughnut';

  // LINE CHART

  public lineChartData: ChartDataSets[] = [
    { data: [1, 0, 2, 1, 1, 1, 1], label: 'Valor actual', ...this.greenColor},
    { data: [1, 1, 2, 2, 1, 1, 1], label: 'Planeado' },
  ];
  public lineChartLabels: Label[] = ['Loma dorada', 'Centro', 'Camichines', 'Jardines', 'La providencia', 'Rosario', 'Jalisco'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: {
          display: false
        }
      }]
    }
  };
  public lineChartType = 'line';


  constructor(
    private titleService: Title,
    private authService: AuthService
  ) {
    this.setTitle('Inicio | MXM');

    this.authService.userObservable.pipe(takeUntil(this.onDestroy)).subscribe((data) => {
      console.log(data);
      this.currentUser = data ? data : false;
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  // On destroy lifecycle //
    ngOnDestroy(): void {
        this.onDestroy.next();
        this.onDestroy.unsubscribe();
    }

}
