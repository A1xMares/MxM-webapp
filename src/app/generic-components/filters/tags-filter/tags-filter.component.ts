import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import {Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ApiService} from '../../../services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {QueryFactory} from '../../../tableQueries/queryFactory';
import {AuthService} from '../../../services/auth/auth.service';
import {SharingService} from '../../../services/sharing/sharing.service';
import {debounceTime, startWith, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.scss']
})
export class TagsFilterComponent implements OnInit, OnDestroy {

  // ================================ COMPONENT CONFIG AND VARIABLES ================================ //

  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //

  @ViewChild('menuDropDown', { static: true }) dropDown: MatMenu;

  @Input()
  set prevValues(values) {
    console.log('receiving prevValues');
    this.selectedObjects = values;
    this.filterContent.emit(this.selectedObjects);
  }

  @Input()
  set config(config) {
    this.configObject = config;
  }

  @Output() filterContent = new EventEmitter();

  /* manage component */
  private onDestroy = new Subject<void>();
  public configObject: any;

  /* manage data */
  public selectedObjects: any[] = [];

  public isBigSize = window.innerWidth > 768;
  public loading = false;

  public manageReturn;

  // -------------------------------------- //
  // Form crud-inputs & validations declaration  //
  // -------------------------------------- //
  public tagsBar = new FormControl({value: '', disabled: false});

  // --------------------- //
  // Component constructor //
  // --------------------- //
  constructor(
      private apiService: ApiService,
      public router: Router,
      public route: ActivatedRoute,
      public queryFactory: QueryFactory,
      public dialog: MatDialog,
      public authService: AuthService,
      private sharingService: SharingService,
  ) { }

  // ------------------ //
  // On view init cycle //
  // ------------------ //
  ngOnInit() {
    window.addEventListener('resize', () => {
      this.isBigSize = window.innerWidth > 768;
    });
  }

  // --------------------- //
  // After view init cycle //
  // --------------------- //
  ngAfterViewInit() {
  }

  // ================================ MANAGE DATA METHODS ================================ //

  public removeObject(selectedIndex: number) {
    this.selectedObjects.splice(selectedIndex, 1);
    this.filterContent.emit(this.selectedObjects);
  }

  public addObject(tag: any) {
    this.selectedObjects.push(tag);
    this.tagsBar.patchValue('');
    this.filterContent.emit(this.selectedObjects);
  }

  clearFilter() {
    this.selectedObjects = [];
    this.filterContent.emit(this.selectedObjects);
  }

  // ================================ DESTROY COMPONENT HOOK MANAGEMENT ================================ //

  // -------------------- //
  // On destroy lifecycle //
  // -------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
