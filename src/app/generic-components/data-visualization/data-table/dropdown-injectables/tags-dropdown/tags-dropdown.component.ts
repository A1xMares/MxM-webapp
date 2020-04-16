import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {ApiService} from "../../../../../services/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {takeUntil} from "rxjs/operators";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-tags-dropdown',
  templateUrl: './tags-dropdown.component.html',
  styleUrls: ['./tags-dropdown.component.scss']
})
export class TagsDropdownComponent implements OnInit, OnDestroy {

  private onDestroy = new Subject<void>();
  public configObj: any;

  public tags = [];

  @Input() set config(conf) {
    this.configObj = conf;
    this.tags = conf.editRow.tags ? conf.editRow.tags : [];
  }

  @Output() changes = new EventEmitter();

  constructor(
      private apiService: ApiService,
      private snackBar: MatSnackBar,
  ) { }

  public tag = new FormControl({value: '', disabled: false});

  ngOnInit() {
  }

  performRequest() {
    this.apiService.editDataObject(this.configObj.editId, {tags: this.tags}, this.configObj.model).pipe(takeUntil(this.onDestroy)).subscribe(() => {
      this.presentToast('Client edited succesfullly', 'green-snackbar');
      this.changes.emit(true);
    }, (e) => {
      this.presentToast('Connection rejected', 'red-snackbar');
    });
  }

  // Add tag to client //
  addTag() {
    const selected = this.tag.value;
    if (selected !== '') {
      this.tags.push(selected);
      this.tag.patchValue('');
    }
  }

  // Add tag to client //
  removeTag(tag: string) {
    this.tags.splice(this.tags.findIndex(obj => obj === tag), 1);
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
