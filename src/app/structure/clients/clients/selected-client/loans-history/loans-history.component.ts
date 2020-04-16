import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {QueryFactory} from '../../../../../tableQueries/queryFactory';
import {DataTableComponent} from '../../../../../generic-components/data-visualization/data-table/data-table.component';
import {DatatableConfig} from '../../../../../models/datatables/datatable-config';
import {DataTableColumnTypes} from '../../../../../models/datatables/data-table-column-types';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TableColumn} from '../../../../../models/datatables/table-column';
import {Subject} from 'rxjs';
import {TableColumnType} from '../../../../../models/datatables/table-column-type';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {ApiService} from '../../../../../services/api/api.service';
import {AuthService} from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-loans-history',
  templateUrl: './loans-history.component.html',
  styleUrls: ['./loans-history.component.scss']
})
export class LoansHistoryComponent implements OnInit, OnDestroy, AfterViewInit {

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
      'loans',
      [],
      'firstname',
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
      const searchObject = this.queryFactory.setSearchQuery(dataSearch, ['firstname', 'lastname', 'role', 'username', 'email']);
      this.datatable.setCustomFilters([searchObject]);
    });
  }

  getColumns(): TableColumn[] {

    const buttonCol = new TableColumnType(
      'button',
      (data) => this.openClient(data.id),
      200,
      {},
      false
    );

    return [
      new TableColumn('firstname', 'NOMBRE', true, this.colTypes.text),
      new TableColumn('lastname', 'APELLIDO', true, this.colTypes.text),
      new TableColumn('role', 'ROL', true, {...this.colTypes.text, formatter: (data) => (data === 'ADMIN' ? 'Administrador' : 'Asesor')}),
      new TableColumn('email', 'EMAIL', true, this.colTypes.text),
      new TableColumn('username', 'USUARIO', true, this.colTypes.text),
      new TableColumn('button', '', false, buttonCol, 'library_books')
    ];
  }

  // --------------------- //
  // Open product function //
  // --------------------- //
  public openClient(data: string) {
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
