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

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss']
})
export class RangeFilterComponent implements OnInit, OnDestroy {

  // ================================ COMPONENT CONFIG AND VARIABLES ================================ //

  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //

  @ViewChild('menuDropDown') dropDown: MatMenu;

  @Input()
  set prevValues(range) {
    this.currentRange = range;
    this.filterContent.emit(this.currentRange);
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
  public currentRange: any = false;

  public isBigSize = window.innerWidth > 768;
  public loading = false;

  // -------------------------------------- //
  // Form crud-inputs & validations declaration  //
  // -------------------------------------- //
  public initRange = new FormControl({value: '', disabled: false});
  public endRange = new FormControl({value: '', disabled: false});

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

  public clearFilter() {
    this.currentRange = false;
    this.initRange.patchValue('');
    this.endRange.patchValue('');
    this.filterContent.emit(this.currentRange);
  }

  public setRange() {
    this.filterContent.emit({
      init: (this.initRange.value > 0 ? this.initRange.value : false),
      end: (this.endRange.value > 0 ? this.endRange.value : false)
    });
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
