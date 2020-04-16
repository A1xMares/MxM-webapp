import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface dataIn {
    secondButton: string;
    firstButton: string;
    title: string;
    subtitle: string;
    message: string[];
}

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-three-buttons.component.html',
  styleUrls: ['./modal-three-buttons.component.scss']
})

export class ModalThreeButtonsComponent {

  constructor(
      public dialogRef: MatDialogRef<ModalThreeButtonsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: dataIn
  ) { }
    confirm(value: boolean) {
        this.dialogRef.close({ confirmation: true, value: value });
    }
    dismiss(): void {
        this.dialogRef.close({ confirmation: false });
    }
}
