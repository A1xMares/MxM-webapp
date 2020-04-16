import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import {QueryFactory} from '../../../tableQueries/queryFactory';
import {FormControl} from '@angular/forms';
import {ApiService} from '../../../services/api/api.service';
import {AuthService} from '../../../services/auth/auth.service';
import {debounceTime, startWith, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-ultimate-select',
  templateUrl: './ultimate-select.component.html',
  styleUrls: ['./ultimate-select.component.scss']
})
export class UltimateSelectComponent implements OnInit, AfterViewInit, OnDestroy {

  // ================================ COMPONENT CONFIG AND VARIABLES ================================ //

  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //

  @ViewChild('menuDropDown', { static: true }) dropDown: MatMenu;

  /* config component input */
  @Input()
  set prevValues(values) {
    this.selectedObjects = values;
    if (!this.configObject.returnItself) {
      this.filterContent.emit(this.processEmitableObject());
    } else {
      this.filterContent.emit(this.selectedObjects);
    }
    this.loadSearch(this.search.value, true);
  }

  @Input()
  set config(config) {
    this.configObject = {...config, needBranch: config.needBranch ? true : false};
  }

  @Output() filterContent = new EventEmitter();

  /* manage component */
  private onDestroy = new Subject<void>();
  public configObject: any;

  /* manage data */
  public filteredObjects: any[] = [];
  public selectedObjects: any[] = [];
  public searchPage = 0;
  public searchCount = 0;

  public isBigSize = window.innerWidth > 768;
  public loading = false;

  public itemsPerParent = 5;

  public manageReturn;

  private firstLoad = true;

  // -------------------------------------- //
  // Form crud-inputs & validations declaration  //
  // -------------------------------------- //
  public search = new FormControl({value: '', disabled: false});

  // --------------------- //
  // Component constructor //
  // --------------------- //
  constructor(
      private apiService: ApiService,
      public queryFactory: QueryFactory,
      public authService: AuthService,
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

    this.dropDown.closed.pipe(takeUntil(this.onDestroy)).subscribe(() => {
      this.loadSearch(this.search.value, true);
    });

  }

  addListener() {
    /* on search change (managing 250 ms) */
    this.search.valueChanges.pipe(
        takeUntil(this.onDestroy),
        debounceTime(250),
        startWith('')
    ).subscribe( (dataSearch) => {
      setTimeout(() => {
        this.loadSearch(dataSearch, true);
      }, 350);
    });
  }

  // ================================ MANAGE DATA METHODS ================================ //

  // ----------- //
  // LOAD SEARCH //
  // ----------- //
  loadSearch(dataSearch: string, count: boolean) {

    console.log('loading ultimate results');

    this.loading = true;
    const searchObject = this.queryFactory.setSearchQuery(dataSearch, this.configObject.searchProperties);
    if (count) {
      this.searchPage = 0;
    }
    /* crete filter object */
    const andObject: any[] = [
      searchObject
    ];

    if (this.selectedObjects.length > 0) {
      andObject.push({ id: {nin: this.getNeqObject() }});
    }

    this.configObject.customFilterProperties.forEach((property, index) => {
      const tempFilter = { [property]: this.configObject.customFilterValues[index] };
      if (tempFilter) {
        andObject.push(tempFilter);
      }
    });

    /* set query properties */
    const page = 25;
    const skip = page * this.searchPage;
    const sorter = this.configObject.sorter;
    /* set get query */
    const getDataQuery = this.queryFactory.generateGetQuery(this.configObject.searchModel, {and: andObject}, page, skip, sorter, this.configObject.includeObject);
    /* preform request */
    this.apiService.getDataObjects(getDataQuery).pipe(takeUntil(this.onDestroy)).subscribe((data: any[]) => {
      this.loading = false;
      if (data.length > 0) {
        if (count) {
          data.forEach((dataObject) => {
            dataObject.color = this.getRandomColor();
          });
          this.filteredObjects = data;
          console.log('ultimate-filter', this.filteredObjects);
        } else {
          data.forEach((dataObject) => {
            dataObject.color = this.getRandomColor();
            this.filteredObjects.push(dataObject);
          });
        }
      } else {
        if (count) {
          this.filteredObjects = [];
        }
      }
    });
  }

  public removeObject(selected: any) {
    clearTimeout(this.manageReturn);
    const removeIndex = this.selectedObjects.findIndex(selObject => selObject.id === selected.id);
    this.filteredObjects.unshift(this.selectedObjects.splice(removeIndex, 1)[0]);
    this.manageReturn = setTimeout(() => {
      if (!this.configObject.returnItself) {
        this.filterContent.emit(this.processEmitableObject());
      } else {
        this.filterContent.emit(this.selectedObjects);
      }
    }, 250);
  }

  public addObject(filtered: any) {
    clearTimeout(this.manageReturn);
    const temp = this.filteredObjects.splice(this.filteredObjects.findIndex(object => object.id === filtered.id), 1);
    // console.log(temp);
    if (temp) {
      this.selectedObjects.push(temp[0]);
    }
    this.manageReturn = setTimeout(() => {
      if (!this.configObject.returnItself) {
        this.filterContent.emit(this.processEmitableObject());
      } else {
        this.filterContent.emit(this.selectedObjects);
      }
    }, 250);
  }

  public processEmitableObject() {
    const tmpEmitable: any[] = [];
    const property = this.configObject.returnProperty;
    this.selectedObjects.forEach((data) => {
      tmpEmitable.push(data[property]);
    });
    return tmpEmitable;
  }

  public onSearchScroll() {
    // console.log('scroll detected');
    this.searchPage++;
    this.loadSearch(this.search.value, false);
  }

  getNeqObject() {
    const neqObject: string[] = [];
    this.selectedObjects.forEach((object) => {
      neqObject.push(object.id);
    });
    return neqObject;
  }

  clearFilter() {
    this.search.patchValue('');
    // this.loadSearch(this.search.value, true);
    this.selectedObjects = [];
    this.filterContent.emit(this.selectedObjects);
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
