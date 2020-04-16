import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../../services/api/api.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {latLng, polygon, tileLayer} from 'leaflet';
import {DataTableComponent} from '../../../../generic-components/data-visualization/data-table/data-table.component';
import {Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {DatatableConfig} from '../../../../models/datatables/datatable-config';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {TableColumn} from '../../../../models/datatables/table-column';
import {TableColumnType} from '../../../../models/datatables/table-column-type';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {QueryFactory} from '../../../../tableQueries/queryFactory';
import {DataTableColumnTypes} from '../../../../models/datatables/data-table-column-types';
import {Title} from '@angular/platform-browser';
import {fadeInBottom, fadeInTop} from '../../../../animations/animatedComponents';
import {Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import * as L from 'leaflet';

@Component({
  selector: 'app-zones-table',
  templateUrl: './zones-table.component.html',
  styleUrls: ['./zones-table.component.scss'],
  animations: [...fadeInTop, ...fadeInBottom]
})
export class ZonesTableComponent implements OnInit, OnDestroy, AfterViewInit {

  drawnItems = new L.FeatureGroup();

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 12,
    center: latLng(20.659698, -103.349609)
  };

  layers = [];
  currentBounds: any;
  map: any;
  branchMarker: any;

  private zones: any[] = [];
  private popUpsHandler: any[] = [];
  private hasPopups = false;


  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5
        }
      }]}
  };

  greenColor = {
    backgroundColor: 'rgba(77,166,43,.4)',
    borderColor: 'rgba(77,166,43,1)',
    hoverBackgroundColor: 'rgba(77,166,43,.7)',
    hoverBorderColor: 'rgba(77,166,43,1)',
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
    backgroundColor: 'rgba(0,149,224,.2)',
    borderColor: 'rgba(0,149,224,1)',
    hoverBackgroundColor: 'rgba(0,149,224,.4)',
    hoverBorderColor: 'rgba(0,149,224,1)'
  };

  public barChartLabels: Label[] = ['Loma dorada', 'Centro', 'Camichines', 'Jardines', 'La providencia', 'Rosario', 'Jalisco'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {data: [17, 19, 12, 14, 15, 10, 18], label: 'CLIENTES TOTALES', ...this.greenColor, borderWidth: 1}
    // { data: [1, 3, 2, 3, 6, 1, 0], label: 'NO PAGÓ', ...this.yellowColor }
  ];


  // Component constructor //
  constructor(
    private apiService: ApiService,
    public router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private colTypes: DataTableColumnTypes,
    private titleService: Title,
    private route: ActivatedRoute,
    private queryFactory: QueryFactory,
  ) {
    this.setTitle('Zonas | MXM');
  }

  @ViewChild('datatable', { static: true }) datatable: DataTableComponent;
  private onDestroy = new Subject<void>();

  // -- BAR CHART

  // Form crud-inputs & validations declaration  //
  public searchbar = new FormControl({value: '', disabled: false});
  public searchObject: any;

  // Set title method //
  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  // ------------------ //
  // On view init cycle //
  // ------------------ //
  ngOnInit() {
  }

  // --------------------- //
  // After view init cycle //
  // --------------------- //
  ngAfterViewInit() {
    this.setFilterListeners();
    this.setTableConfig();
  }

  setTableConfig() {
    this.datatable.config = new DatatableConfig(
      'zones',
      [],
      'name',
      'asc',
      this.getColumns(),
      1,
      false
    );
  }

  setFilterListeners() {
    this.searchbar.valueChanges.pipe(
      takeUntil(this.onDestroy),
      debounceTime(250)
    ).subscribe( (dataSearch) => {
      this.searchObject = this.queryFactory.setSearchQuery(dataSearch, ['name']);
      this.datatable.setCustomFilters(this.getFilters());
    });
  }

  getFilters() {
    const filter: any[] = [];
    if (this.searchObject) { filter.push(this.searchObject); }
    return filter;
  }

  getColumns(): TableColumn[] {

    const buttonCol = new TableColumnType(
      'button',
      (data) => this.openZone(data.id),
      200,
      {},
      false
    );

    return [
      new TableColumn('name', 'NOMBRE', true, this.colTypes.text),
      new TableColumn('button', 'ABRIR', false, buttonCol, 'library_books')
    ];
  }

  processZones(data: any[]) {
    this.hasPopups = false;
    this.zones = data;
    this.layers = data.map((poly) => (polygon(poly.points ? poly.points.map((geo) => [geo.lat, geo.lng]) : [] )));
    this.currentBounds = polygon(data.map((poly) => (poly.points ? poly.points.map((geo) => [geo.lat, geo.lng]) : [] )));
  }

  centerChange() {
    if (!this.hasPopups) {

      if (this.popUpsHandler.length > 0) {
        this.popUpsHandler.forEach((popUp) => {
          popUp.removeFrom(this.map);
        });
        this.popUpsHandler = [];
      }

      this.hasPopups = true;
      this.zones.forEach((zone, index) => {
        const center = this.layers[index].getBounds().getCenter();
        const tmp = L.popup({
          closeButton: false,
          autoClose: false,
          closeOnClick: false,
          closeOnEscapeKey: false,
          className: 'customPopup'
        })
          .setLatLng(center)
          .setContent(this.zones[index].name)
          .openOn(this.map);
        this.popUpsHandler.push(tmp);
        // this.branchMarker
      });
    }
  }

  /*getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }*/

  mapLoaded(mapEvent: any) {
    this.map = mapEvent;
    const tmpIcon = L.icon({
      iconUrl: '../../../../../assets/img/home_pin.png',
      iconSize: [35, 35],
      iconAnchor: [17.5, 35],
    });
    this.branchMarker = L.marker([20.627513, -103.259217], {
      icon: tmpIcon,
      title: 'Sucursal matriz, Avenida Río Nilo 8154, Loma Dorada, Tonalá Jalisco',
      riseOnHover: true,
      riseOffset: 1000
    }).addTo(this.map);
  }

  // --------------------- //
  // Open product function //
  // --------------------- //
  public openZone(data: string) {
    this.router.navigate([data], {relativeTo: this.route}).catch();
  }

  // -------------------- //
  // On destroy lifecycle //
  // -------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
