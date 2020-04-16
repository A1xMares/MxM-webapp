import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../../services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../../services/auth/auth.service';
import {DataTableColumnTypes} from '../../../../models/datatables/data-table-column-types';
import {Title} from '@angular/platform-browser';
import {QueryFactory} from '../../../../tableQueries/queryFactory';
import {DataTableComponent} from '../../../../generic-components/data-visualization/data-table/data-table.component';
import {Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {DatatableConfig} from '../../../../models/datatables/datatable-config';
import {TableColumn} from '../../../../models/datatables/table-column';
import {TableColumnType} from '../../../../models/datatables/table-column-type';
import {fadeInBottom, fadeInTop} from '../../../../animations/animatedComponents';

@Component({
  selector: 'app-loans-table',
  templateUrl: './loans-table.component.html',
  styleUrls: ['./loans-table.component.scss'],
  animations: [...fadeInTop, ...fadeInBottom]
})
export class LoansTableComponent implements OnInit, OnDestroy, AfterViewInit {

  // --------------------- //
  // Component constructor //
  // --------------------- //
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
    this.setTitle('Prestamos | MXM');
  }

  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //

  @ViewChild('datatable', { static: true }) datatable: DataTableComponent;

  private onDestroy = new Subject<void>();

  // ------------------------------------------- //
  // Form crud-inputs & validations declaration  //
  // ------------------------------------------- //
  public searchbar = new FormControl({value: '', disabled: false});
  public zone = new FormControl({value: '', disabled: false});

  public searchObject: any;
  public zoneFilterObject: any;

  public zoneOptions: any[] = [];

  // ---------------- //
  // Set title method //
  // ---------------- //
  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  // ------------------ //
  // On view init cycle //
  // ------------------ //
  ngOnInit() {
    this.getZones();
  }

  // --------------------- //
  // After view init cycle //
  // --------------------- //
  ngAfterViewInit() {
    this.setFilterListeners();
    this.setTableConfig();
  }

  getZones() {
    this.apiService.getDataObjects('zones?filter=' + JSON.stringify({
      fields: ['name', 'id']
    })).pipe(
      takeUntil(this.onDestroy)
    ).subscribe((data: any) => {
      this.zoneOptions = data.data;
    });
  }

  setTableConfig() {
    this.datatable.config = new DatatableConfig(
      'loans',
      [],
      'createTime',
      'desc',
      this.getColumns(),
      3,
      false,
      null,
      null,
      2
    );
  }

  setFilterListeners() {
    this.searchbar.valueChanges.pipe(
      takeUntil(this.onDestroy),
      debounceTime(250)
    ).subscribe( (dataSearch) => {
      this.searchObject = this.queryFactory.setSearchQuery(dataSearch, ['firstname', 'lastname', 'phone', 'rfc', 'status']);
      this.datatable.setCustomFilters(this.getFilters());
    });

    this.zone.valueChanges.pipe(
      takeUntil(this.onDestroy)
    ).subscribe( (data) => {
      this.zoneFilterObject = data;
      this.datatable.setCustomFilters(this.getFilters());
    });
  }

  getFilters() {
    const filter: any[] = [];
    if (this.searchObject) { filter.push(this.searchObject); }
    if (this.zoneFilterObject !== '') { filter.push( {zoneId: this.zoneFilterObject} ); }
    return filter;
  }

  getColumns(): TableColumn[] {

    const buttonCol = new TableColumnType(
      'button',
      (data) => this.openLoan(data.id),
      200,
      {},
      false
    );

    const statusCol = { ...this.colTypes.text, minWidthNumber: 100, maxWidthText: '100px' };

    const loansCol = {
      ...this.colTypes.relation,
      formatter: (data) => (data ? data.loans ? data.loans.length : 0 : 0),
      minWidthNumber: 80, maxWidthText: '80px'
    };

    const zoneCol = {
      ...this.colTypes.relation,
      formatter: (data) => (data ? data.zone ? data.zone.name : 'N/D' : 'N/D')
    };

    const addressCol = {
      ...this.colTypes.relation,
      formatter: (data) => (data ? data.location ? data.location.address : 'N/D' : 'N/D')
    };

    return [
      new TableColumn('firstname', 'NOMBRE', true, this.colTypes.text),
      new TableColumn('lastname', 'APELLIDOS', true, this.colTypes.text),
      new TableColumn('phone', 'TELEFONO', true, this.colTypes.phoneNumber),
      new TableColumn('zone', 'ZONA', true, zoneCol),
      new TableColumn('rfc', 'RFC', true, this.colTypes.text),
      new TableColumn('address', 'RFC', true, addressCol, null, 2),
      new TableColumn('phoneRef', 'TEL. REFERENCIA', true, this.colTypes.phoneNumber),

      new TableColumn('status', 'ESTATUS', true, statusCol),
      new TableColumn('loans', 'PREST.', false, loansCol),
      new TableColumn('button', 'ABRIR', false, buttonCol, 'library_books')
    ];
  }

  // --------------------- //
  // Open product function //
  // --------------------- //
  public openLoan(data: string) {
    // this.router.navigate([data], {relativeTo: this.route}).catch();
  }

  // -------------------- //
  // On destroy lifecycle //
  // -------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
