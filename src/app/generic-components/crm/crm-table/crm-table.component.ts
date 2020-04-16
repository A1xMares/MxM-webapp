import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {fadeIn, fadeInBottom, fadeInTop, tableRow} from '../../../animations/animatedComponents';
import {Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../../services/auth/auth.service';
import {TableColumn} from '../../../models/datatables/table-column';
import {DataTableColumnTypes} from '../../../models/datatables/data-table-column-types';
import {DataTableComponent} from '../../data-visualization/data-table/data-table.component';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {QueryFactory} from '../../../tableQueries/queryFactory';

@Component({
  selector: 'app-crm-table',
  templateUrl: './crm-table.component.html',
  styleUrls: ['./crm-table.component.scss'],
  animations: [fadeIn, fadeInBottom, fadeInTop, tableRow],
})
export class CrmTableComponent implements OnInit, OnDestroy, AfterViewInit {

  sortItem: any = false;

  @ViewChild('datatable', {static: true}) datatable: DataTableComponent;

  /* manage component */
  private onDestroy = new Subject<void>();
  public firstLoad = true;
  private filterTimer: any;

  /* manage tags */
  @ViewChild('tags', {static: true}) tags;
  @ViewChild('tagsFilter', {static: false}) tagsFilter;
  public prevtags: string[] = [];
  public tagsConfig = {isFormControl: false};

  @ViewChild('products', {static: true}) products;
  @ViewChild('productsFilter', {static: false}) productsFilter;
  public prevproducts: any[] = [];
  public productsConfig = {isFormControl: false};

  @ViewChild('grains', {static: true}) grains;
  @ViewChild('grainsFilter', {static: false}) grainsFilter;
  public prevgrains: any[] = [];
  public grainsConfig = {isFormControl: false};

  @ViewChild('targetPrice', {static: true}) targetPrice;
  @ViewChild('targetPriceFilter', {static: false}) targetPriceFilter;
  public prevtargetPrice: any = {};
  public targetPriceConfig = {isFormControl: false};

  @ViewChild('buyers', {static: true}) buyers;
  @ViewChild('buyersFilter', {static: false}) buyersFilter;
  public prevbuyers: any[] = [];
  public buyersConfig = {isFormControl: false};

  @ViewChild('groups', {static: true}) groups;
  @ViewChild('groupsFilter', {static: false}) groupsFilter;
  public prevgroups: any[] = [];
  public groupsConfig = {isFormControl: false};

  @ViewChild('mapRange', {static: true}) mapRange;
  @ViewChild('mapRangeFilter', {static: false}) mapRangeFilter;
  public prevmapRange: any = {};
  public mapRangeConfig = {isFormControl: false};

  @ViewChild('rating', {static: true}) rating;
  public ratingConfig = {isFormControl: true, formControlName: 'rate', defaultValue: [] };
  public rate = new FormControl({value: '', disabled: false}); // FORM CONTROL

  @ViewChild('category', {static: true}) category;
  public categoryConfig = {isFormControl: true, formControlName: 'categories', defaultValue: []};
  public categories = new FormControl({value: '', disabled: false}); // FORM CONTROL

  public searchbar = new FormControl({value: '', disabled: false}); // FORM CONTROL
  public searchbarConfig = {isFormControl: true, formControlName: 'categories', defaultValue: ''};

  customDynamicFilters: any[] = [];

  public config: any = {filtersArray: [], hasMap: false};
  public tableConfig: any;

  public editAccess = false;
  public showMap = false;

  public dynamicCols: any[] = [];

  @Output() newSubject = new EventEmitter();
  @Output() editSubject = new EventEmitter();
  @Output() openSubject = new EventEmitter();

  constructor(
      private authService: AuthService,
      private colTypes: DataTableColumnTypes,
      private queryFactory: QueryFactory
  ) { }

  @Input() set setConfig(conf) {
    this.config = { ...conf };

    this.processConfigFilters();
    this.editAccess = conf.editAccess;

    this.setSearchbar();
    this.getPrevFilters();

    this.setTableConfig();

    setTimeout(() => {
      this.firstLoad = false;
    }, 1000);
  }

  reloadTable(load: boolean) {
    this.datatable.reload(load);
  }

  /* process access per role and point filter ng template */
  processConfigFilters() {
    if (this.config.filtersArray) {
      this.config.filtersArray.forEach((filter) => {
        if (this[filter.template]) {
          filter.templatePointer = this[filter.template];
        }
      });
    }
  }

  ngOnInit() {}

  getPrevFilters() {
    const jsonItem = localStorage.getItem(this.config.identifier + 'Filters');
    let prevItems: any;
    if (jsonItem) {
      prevItems = JSON.parse(jsonItem);

      this.customDynamicFilters = prevItems;

      prevItems.forEach((filterItem: any) => {
        if (this[(filterItem.template + 'Config')].isFormControl) {
          this[this[(filterItem.template + 'Config')].formControlName].patchValue(filterItem.rawData);
        } else {
          this[('prev' + filterItem.template)] = filterItem.rawData;
        }
      });
    }

    const sortItem = localStorage.getItem((this.config.identifier + 'Sorter'));
    if (sortItem) {
      this.sortItem = JSON.parse(sortItem);
    }
  }

  setTableConfig() {
    console.log('setting table config by dynamic cols');
    const tmpTableConf = {
      ...this.config.tableConfig,
    };

    if (this.sortItem) {
      if (this.sortItem.sorterProp && this.sortItem.sorterDirection) {
        tmpTableConf.sorterProp = this.sortItem.sorterProp;
        tmpTableConf.sorterDirection = this.sortItem.sorterDirection;
      }
    }

    tmpTableConf.columns = this.getAllCols(this.config.tableConfig.columns, tmpTableConf.fromRightRemoveIndex);
    tmpTableConf.fromRightRemoveIndex = (this.config.tableConfig.fromRightRemoveIndex + this.dynamicCols.length);
    this.tableConfig = tmpTableConf;

    let tmpArr = [ ...this.customDynamicFilters.map(filter => filter.appliedFilter) ];
    if (this.config.customFilters) {
      tmpArr = [ ...tmpArr, ...this.config.customFilters];
    }
    this.datatable.setCustomFilters(tmpArr);

    this.datatable.config = this.tableConfig;
  }

  getAllCols(cols: TableColumn[], fromRightRemoveIndex: number) {
    const tmpCols = [...cols];

    if (this.config.hasDynamicCols) {
      this.dynamicCols.forEach((prod) => {
        tmpCols.splice(
            (cols.length - fromRightRemoveIndex),
            0,
            new TableColumn(
                ('productsAvailable.' + prod.formattedName),
                prod.abbreviation,
                true,
                {...this.colTypes.text, type: 'relation', minWidthNumber: 80, maxWidthText: '80px', formatter: (data) => data ? data.productsAvailable ? data.productsAvailable[prod.formattedName] ? data.productsAvailable[prod.formattedName].toLocaleString() : 0 : 0 : 0},
                '',
                1
            )
        );
      });
    }

    console.log('cols', cols);
    console.log('new cols', tmpCols);

    return tmpCols;
  }

  ngAfterViewInit(): void {
  }

  setSearchbar() {
    this.searchbar.valueChanges.pipe(
        takeUntil(this.onDestroy),
        debounceTime(250)
    ).subscribe( (dataSearch) => {
      const filterIndex = this.customDynamicFilters.findIndex((filter) => filter.template === 'searchbar');
      if (filterIndex !== -1) {
        this.customDynamicFilters[filterIndex] = {
          template: 'searchbar', appliedFilter: this.queryFactory.setSearchQuery(dataSearch, this.config.searchProperties), rawData: dataSearch
        };
      } else {
        this.customDynamicFilters.push({
          template: 'searchbar', appliedFilter: this.queryFactory.setSearchQuery(dataSearch, this.config.searchProperties), rawData: dataSearch
        });
      }
      this.setCustomFilters();
    });
  }

  setFilterValue(template: string, data: any) {

    const tmpObj = this.config.filtersArray.find(filter => filter.template === template);
    const tmpFilter = {template: tmpObj.template, appliedFilter: JSON.parse(tmpObj.appliedFilter), processArray: tmpObj.processArray, rawData: data};

    const filterIndex: any = this.customDynamicFilters.findIndex((filter) => filter.template === tmpFilter.template);

    if (tmpFilter.appliedFilter) {
      if (this.config.hasDynamicCols && (tmpFilter.template === this.config.dynamicColsFilter)) {
        this.processDynamicCols(tmpFilter, data, filterIndex);
      } else if (tmpFilter.template === 'targetPrice' && !tmpFilter.processArray) { // SPECIFIC IF TEMPLATE IS 'targetPrice'
        this.processDynamicFilterRange(tmpFilter, data);
      } else if (data && (data.length > 0) ) {
        if (tmpFilter.template === 'mapRange') { // SPECIFIC IF TEMPLATE IS 'mapRange'
          this.iterateFilterValue(tmpFilter.appliedFilter, [], data[0].filterObj);
        } else {
          this.iterateFilterValue(tmpFilter.appliedFilter, [], data.map(e => tmpFilter.processArray(e)));
        }
        if (filterIndex !== -1) {
          this.customDynamicFilters[filterIndex] = tmpFilter;
        } else {
          this.customDynamicFilters.push(tmpFilter);
        }
        this.setCustomFilters();
      } else {
        if (filterIndex !== -1) {
          this.customDynamicFilters.splice(filterIndex, 1);
          this.setCustomFilters();
        }
      }
    }
  }

  iterateFilterValue(tmpFilter, prevArr, val) {
    for (const tmpFilterKey in tmpFilter) {
      if (tmpFilter[tmpFilterKey] === '$filter') {
        tmpFilter[tmpFilterKey] = val;
      } else if (typeof tmpFilter[tmpFilterKey] === 'object') {
        prevArr.push(tmpFilterKey);
        this.iterateFilterValue(tmpFilter[tmpFilterKey], prevArr, val);
      }
    }
  }

  processDynamicFilterRange(tmpFilter, data: any) {
    const filterIndex = this.customDynamicFilters.findIndex((filter) => filter.template === this.config.dynamicColsFilter);
    if (this.dynamicCols.length > 0 && data) {
      const filterObject = this.dynamicCols.map(col => ({and: [
        { ['productsPrices.' + col.formattedName]: {gt: data.init} },
        { ['productsPrices.' + col.formattedName]: {lt: data.end} }
      ]}));
      tmpFilter.appliedFilter = {or: filterObject};
      if (filterIndex !== -1) {
        this.customDynamicFilters[filterIndex] = tmpFilter;
      } else {
        this.customDynamicFilters.push(tmpFilter);
      }
      this.setCustomFilters();
    } else {
      if (filterIndex !== -1) {
        this.customDynamicFilters.splice(filterIndex, 1);
        this.setCustomFilters();
      }
    }
  }

  processDynamicCols(tmpFilter, data, filterIndex) {

    console.log('processing dynamic cols');

    this.dynamicCols = data.map( (dynamicCol) => ({
      formattedName: this.setFormmatedReq(dynamicCol.name),
      abbreviation: this.getColAbbreviation(dynamicCol.name),
      name: dynamicCol.name
    }));

    const tmpValue = this.dynamicCols.map((col) => tmpFilter.processArray(col));

    this.iterateFilterValue(tmpFilter.appliedFilter, [], tmpValue );

    if (this.dynamicCols.length > 0) {
      if (filterIndex !== -1) {
        this.customDynamicFilters[filterIndex] = tmpFilter;
      } else {
        this.customDynamicFilters.push(tmpFilter);
      }
    } else {
      if (filterIndex !== -1) {
        this.customDynamicFilters.splice(filterIndex, 1);
      }
    }

    this.checkTargetPrice();
    this.setCustomFilters();
    this.setTableConfig();
  }

  checkTargetPrice() {
    const filterIndex = this.customDynamicFilters.findIndex((filter) => filter.template === 'targetPrice');
    if (filterIndex !== -1) {
      this.setFilterValue('targetPrice', this.customDynamicFilters[filterIndex].rawData);
    }
  }

  setFormmatedReq(name: string) {
    return name.replace(/ /g, '_').toLowerCase();
  }

  getColAbbreviation(product: string) {
    const splittedProduct = product.split(' ');
    if (splittedProduct.length > 1) {
      return splittedProduct[0].substring(0, 1) + '.' + splittedProduct[1].substring(0, 1) + '.';
    } else {
      return splittedProduct[0].substring(0, 2) + '.';
    }
  }

  setCustomFilters() {
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }

    if (!this.firstLoad) {
      this.filterTimer = setTimeout(() => {
        console.log('setting filter');

        let tmpArr = [ ...this.customDynamicFilters.map(filter => filter.appliedFilter) ];
        if (this.config.customFilters) {
          tmpArr = [ ...tmpArr, ...this.config.customFilters];
        }
        this.datatable.setCustomFilters(tmpArr);

        localStorage.setItem(this.config.identifier + 'Filters', JSON.stringify(this.customDynamicFilters));
      }, 50);
    }
  }

  setSort(e: any) {
    localStorage.setItem(this.config.identifier + 'Sorter', JSON.stringify({sorterProp: e.active, sorterDirection: e.direction}));
  }

  resetFilters() {
    this.customDynamicFilters = [];
    this.config.filtersArray.forEach((filterItem) => {
      if (this[(filterItem.template + 'Config')].isFormControl) {
        this[this[(filterItem.template + 'Config')].formControlName].patchValue(this[(filterItem.template + 'Config')].defaultValue);
      } else {
        this[(filterItem.template + 'Filter')].clearFilter();
      }
    });
  }

  obtainTypeValue(value: string) {
    switch (value) {
      case 'producer':
        return 'Producer';
      case 'broker':
        return 'Broker';
      case 'elevator':
        return 'Elevator';
      case 'cleaning':
        return 'Cleaning plant';
      default:
        return '';
    }
  }

  validateCategory(categories: string[], match) {
    if (categories.length > 0) {
      return categories.findIndex(cat => cat === match) > -1;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
