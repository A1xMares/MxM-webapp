import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, HostListener,
  Input,
  OnDestroy,
  OnInit, Output, Pipe, PipeTransform,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from '../../../services/api/api.service';
import {DatatableConfig} from '../../../models/datatables/datatable-config';
import {CustomDataSource} from '../../../tableQueries/customDataSource';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatSort} from '@angular/material/sort';
import {QueryFactory} from '../../../tableQueries/queryFactory';
import {AuthService} from '../../../services/auth/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {TableColumn} from '../../../models/datatables/table-column';
import {MatSnackBar} from '@angular/material/snack-bar';
import {state, style, trigger} from '@angular/animations';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {fadeIn, fadeInBottom, fadeInTop, tableRow} from '../../../animations/animatedComponents';
import {DataTableColumnTypes} from '../../../models/datatables/data-table-column-types';
import {ContainerRef} from 'ngx-infinite-scroll';
import {Container} from '@angular/compiler/src/i18n/i18n_ast';
import {DomSanitizer} from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
// import {Socket} from "ngx-socket-io";

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ display: 'none' })),
      state('expanded', style({ height: '*', display: 'flex' }))
    ]), fadeIn, fadeInBottom, fadeInTop, tableRow
  ]
})

export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {


  @Input() set config(conf: DatatableConfig) {
    console.log('setting datatable config', conf);
    if (conf) {
      this.configObject = conf;
      this.drawTable();
      /*if (this.configObject.socketEvent) {
        this.setSocketListener();
      }*/
    }
  }

  constructor(
      private apiService: ApiService,
      public changeDetectorRef: ChangeDetectorRef,
      public media: MediaMatcher,
      public queryFactory: QueryFactory,
      public dialog: MatDialog,
      public authService: AuthService,
      private snackBar: MatSnackBar,
      private bottomSheet: MatBottomSheet,
      private colTypes: DataTableColumnTypes,
      // private socket: Socket
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  private containerHeight = 0;
  public tableScroll = false;

  /* manage component */
  private onDestroy = new Subject<void>();
  public firstLoad = true;
  public prevBranch = false;

  /* manage table referenced components */
  @ViewChild('tableContainer', { static: true }) tableContainer: ElementRef;
  @ViewChild('heightContainer', { static: true }) heightContainer: ElementRef;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  /* manage custom expandible container */
  @ViewChild('customExpandibleContainer', { static: false }) customExpandibleContainer: any;

  /* manage custom expandible rows */
  @ViewChild('tempDefault', { static: false }) tempDefault;
  @ViewChild('user', { static: false }) user;
  @ViewChild('purchaseContracts', { static: false }) purchaseContracts;
  @ViewChild('salesContracts', { static: false }) salesContracts;
  @ViewChild('note', { static: false }) note;
  @ViewChild('lastNotes', { static: false }) lastNotes;

  @ViewChild('tagsDropdown', { static: false }) tagsDropdown;
  @ViewChild('prodsDropdown', { static: false }) prodsDropdown;
  @ViewChild('rateDropdown', { static: false }) rateDropdown;

  /* manage columns */
  public displayedColumns: string[] = [];
  public displayedColumnsConfig: TableColumn[] = [];
  public noDisplayedColumns: string[] = [];
  public noDisplayedColumnsConfig: TableColumn[] = [];

  /* manage responsive */
  private mobileQueryListener: () => void;
  public mobileQuery: MediaQueryList;

  /* manage table data injection */
  public dataSource: CustomDataSource;
  public tableCount = -1;
  public pageSize = 25;
  public configObject: DatatableConfig;

  /* manage component feedback to user */
  public loading = false;
  private drawTimeout: any;

  /* manage hover event */
  public hoverCell = '';
  public expandedElement: any = {id: '-'};
  public expandedElementTwo: any = {id: '-'};

  /* manage expand */
  public selectedTemplate = this.tempDefault;
  public selectedDropdown = this.tempDefault;
  animationRowSide = '';
  hasExpandOption = false;

  /* manage cell buttons */
  public model = '';
  public editConfig: any;
  public tempEditData: any = null;
  public editProp = '';
  public editId = '';
  public isEditing = false;
  public editTitle = '';
  public editRow: any = false;
  public editColIndex = -1;
  /* select dropdown */
  private salectData: any = [];

  /* manage filters */
  private customFilters: any = [];

  @Output() tableLoad = new EventEmitter();

  @Output() onQuickEditNote = new EventEmitter();
  @Output() seeNoteParticipants = new EventEmitter();
  @Output() onSortChange = new EventEmitter();
  public isExpansionDetailRow = (i: number, row: object) => true;
  public isExpansionDetailRowTwo = (i: number, row: object) => true;

  @Input() setCustomFilters(customFilters: any) {
    if (customFilters) {
      this.customFilters = customFilters;
      if (!this.firstLoad) {
        this.loadTableData(true, this.sort, true);
      }
    }
  }

  @Input() reload(resetCount: boolean) {
    this.loadTableData(true, this.sort, resetCount);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    clearTimeout(this.drawTimeout);
    this.drawTimeout = setTimeout(() => {
      this.drawTable();
    }, 250);
  }

  ngOnInit() {
    this.dataSource = new CustomDataSource(this.apiService);

    if (localStorage.getItem('pageSize')) {
      this.pageSize = parseInt(localStorage.getItem('pageSize'), 10);
    }
  }

  setPage(e: any) {
    if (e.pageIndex > e.previousPageIndex) {
      this.animationRowSide = 'left';
    } else {
      this.animationRowSide = 'right';
    }

    if (this.paginator) {
      localStorage.setItem('pageSize', this.paginator.pageSize.toString());
    }
  }

  setSocketListener() {
    /*if (this.socket) {
      this.socket.on(this.configObject.socketEvent, (data) => {
        console.log('getting response from socket (callback)', data);
        if (data === 'new') {
          this.loadTableData(true, this.sort, false);
        } else {
          this.loadTableData(false, this.sort, false);
        }
      });
    }*/
  }
  checkChange(value: any, editId: any, model: any) {
    const date = new Date();
    const editObjct = {
      done: value
    };
    this.apiService.editDataObject(editId, editObjct, model)
     .pipe(takeUntil(this.onDestroy)).subscribe(() => {
       this.presentToast('Dato de la celda editado correctamente', 'green-snackbar');
       this.reload(false);
      }, err => {
       this.presentToast('Error', 'red-snackbar');
    });
  }
  ngAfterViewInit(): void {}

  setBranchListener() {

    this.prevBranch = true;
  }

  drawTable() {

    /* container width */
    const containerWidth = this.tableContainer.nativeElement.offsetWidth;

    let fromRight = this.configObject.fromRightRemoveIndex;

    if (containerWidth < 500) {
      fromRight = 2;
    } else if (containerWidth < 850) {
      fromRight = 3;
    }

    /* declare last removable index from right */
    const lastRemovableIndex = this.configObject.columns.length - fromRight;
    const firstRemovable = this.configObject.fromLeftRemoveIndex;

    this.containerHeight = (this.heightContainer.nativeElement.offsetHeight - 45);

    /* declare 1: max removable cols width,
               2: iterable width cont, 3: iterable index cont */

    const fixedColsMinWidth = this.configObject.columns.filter((col, index) => (index > lastRemovableIndex))
        .reduce((acc, col) => acc + col.columnType.minWidthNumber, 0);

    const maxDynamicColsWidth = containerWidth - fixedColsMinWidth;

    let widthCont = 0;
    let indexCont = 0;

    /* iterate config columns to calculate which cols can be displayed */
    this.configObject.columns.forEach((col, index) => {
      widthCont += col.columnType.minWidthNumber;
      if ((widthCont < maxDynamicColsWidth || index < firstRemovable)) {
        indexCont++;
      }
    });

    /* filter displayed columns and return array of columnsConfig */
    this.displayedColumnsConfig = this.configObject.columns
        .filter((col, i) => ((i < indexCont && i < lastRemovableIndex) || i >= lastRemovableIndex));

    /* map displayedColumnsConfig array and return array of columnConfig.property */
    this.displayedColumns = this.displayedColumnsConfig.map(displayedConfig => displayedConfig.property);

    /* filter noDisplayed columns and return array of mappedObject.name */
    this.noDisplayedColumnsConfig = this.configObject.columns
        .filter((col, i) => (i >= indexCont && i < lastRemovableIndex));

    /* map noDisplayedColumnsConfig array and return array of columnConfig.property */
    this.noDisplayedColumns = this.noDisplayedColumnsConfig.map(noDisplayedConfig => noDisplayedConfig.property);

    if (this.noDisplayedColumns.length > 0) {
      //
      if (this.displayedColumns.findIndex(col => col === 'expandHidden') === -1) {
        console.log('adding expanded column');
        this.hasExpandOption = true;
        this.displayedColumns.push('expandHidden');
        this.displayedColumnsConfig.push(new TableColumn('expandHidden', 'VER +', false, this.colTypes.expandHidden, '' ));
      }
    } else {
      if (this.displayedColumns.findIndex(col => col === 'expandHidden') !== -1) {
        console.log('removing expanded column');
        this.displayedColumns.splice(this.displayedColumns.length, 1);
        this.displayedColumnsConfig.splice(this.displayedColumnsConfig.length, 1);
      }
      this.hasExpandOption = false;
    }

    this.loadTableData(true, this.sort, true);

  }

  public loadTableData(count: boolean, sort: any, resetCount: boolean) {

    if (!this.firstLoad) { this.loading = true; }

    /* set query props */
    const page = this.paginator ? this.paginator.pageSize : 25;
    const skip = this.paginator ? page * this.paginator.pageIndex : 0;

    const customFilters: any[] = [ ...this.customFilters ];

    /* add branch filter 1.- if is filtered by branch 2.- if not, add validation when role !== 'generalAdmin' */
    if (this.configObject.searchModel !== 'AppUsers') {

    } else {

    }

    /* generate get request */
    const getDataQuery = this.queryFactory.generateGetQuery(
        this.configObject.searchModel,
        customFilters.length > 0 ? {and: customFilters} : {},
        page,
        skip,
        sort ? this.queryFactory.setSorterProperty(sort) : this.configObject.sorterProp + ' ' + this.configObject.sorterDirection,
        this.configObject.includeObject
    );

    if (count) {

      /* generate count request */
      const getCountQuery = this.queryFactory.generateGetCountQuery(
          this.configObject.searchModel,
          customFilters.length > 0 ? {and: customFilters} : {}
      );

      const needNewDataSource = this.tableCount === 0 || (this.firstLoad && this.prevBranch);

      if (needNewDataSource) { this.dataSource = new CustomDataSource(this.apiService); }
      this.dataSource.loadData(getDataQuery).pipe(takeUntil(this.onDestroy)).subscribe((data) => {

        this.tableLoad.emit(data);

        this.animationRowSide = '';
        this.tableCount = this.dataSource.count;
        if (resetCount) {
          if (this.paginator) { this.paginator.firstPage(); }
        }
        this.loading = false;
        setTimeout(() => {
          this.firstLoad = false;
        }, 100);
      });

      /* preform count request */
      /*this.apiService.getDataObjects(getCountQuery).pipe(takeUntil(this.onDestroy)).subscribe((count: any) => {
        this.tableCount = count.count;
        if (this.tableCount > 0) {


        } else {
          this.loading = false;
          setTimeout(() => {
            this.firstLoad = false;
          }, 100);
        }
      });*/

    } else {

      this.dataSource.loadData(getDataQuery).pipe(takeUntil(this.onDestroy)).subscribe((data) => {
        this.loading = false;
      });

    }
  }

  copyData(data) {
    const text = document.createElement('textarea');
    text.value = data;
    text.style.position = 'absolute';
    text.style.left = '-9999px';
    // el.setAttribute('readonly', '');
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    document.body.removeChild(text);
    this.presentToast('Dato copiado', 'gray-snackbar');
  }

  presentToast(message: string, style: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 1000,
      panelClass: [style],
      horizontalPosition: 'end',
      verticalPosition: document.documentElement.clientWidth >= 1050 ? 'top' : 'bottom'
    });
  }
  openBottomSheet() {
    // this.bottomSheet.open();
  }

  setCustomExpandible(template: string, dataRow: any) {
    this.selectedTemplate = this[template];
    this.expandedElementTwo = this.expandedElementTwo !== dataRow ? dataRow : { };
  }

  setDropdown(template: string, dataRow: any) {
    this.selectedDropdown = this[template];
  }

  openParticipants(data: any) {
    this.seeNoteParticipants.emit(data);
  }

  quickEdit(data: any, id: string) {
    this.onQuickEditNote.emit({data, id});
  }

  // For open note modal
  openNote(note: any) {
  }

  setCopyWhileScroll() {
    this.tableScroll = true;
    setTimeout(() => {
      this.tableScroll = false;
    }, 250);
  }


  // -------------------- //
  // On destroy lifecycle //
  // -------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
    // this.onDestroy.complete();
  }

}
