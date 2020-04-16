import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ApiService} from "../../../../../services/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-rate-dropdown',
  templateUrl: './rate-dropdown.component.html',
  styleUrls: ['./rate-dropdown.component.scss']
})
export class RateDropdownComponent implements OnInit, OnDestroy {

  private onDestroy = new Subject<void>();
  public configObj: any;

  private currentActive = 0;
  public isActive1 = false;
  public isActive2 = false;
  public isActive3 = false;
  public isActive4 = false;
  public isActive5 = false;

  @Input() set config(conf) {
    this.configObj = conf;
    this.currentActive = conf.editRow.rate ? conf.editRow.rate : 0;
    this.changeRate(this.currentActive);
  }

  @Output() changes = new EventEmitter();

  constructor(
      private apiService: ApiService,
      private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  changeRate(rate: number) {
    this.currentActive = rate;
    for (let x = 1; x <= 5; x++) {
      if (rate < x) {
        this['isActive' + x] = false;
      } else {
        this['isActive' + x] = true;
      }
    }
  }

  performRequest() {
    this.apiService.editDataObject(this.configObj.editId, {rate: this.currentActive}, this.configObj.model).pipe(takeUntil(this.onDestroy)).subscribe(() => {
      this.presentToast('Client edited succesfullly', 'green-snackbar');
      this.changes.emit(true);
    }, (e) => {
      this.presentToast('Connection rejected', 'red-snackbar');
    });
  }

  presentToast(message: string, style: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [style],
      horizontalPosition: 'end',
      verticalPosition: document.documentElement.clientWidth >= 1050 ? 'top' : 'bottom'
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
