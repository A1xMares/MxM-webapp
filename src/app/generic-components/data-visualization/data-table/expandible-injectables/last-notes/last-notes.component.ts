import {Component, Input, OnInit} from '@angular/core';
import {DataTableColumnTypes} from "../../../../../models/datatables/data-table-column-types";

@Component({
  selector: 'app-last-notes',
  templateUrl: './last-notes.component.html',
  styleUrls: ['./last-notes.component.scss']
})
export class LastNotesComponent implements OnInit {

  public notes: any[] = [];

  @Input() set config(conf) {
    this.notes = conf.notes;
  }

  constructor(
      public colTypes: DataTableColumnTypes
  ) { }

  ngOnInit() {
  }

}
