import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import {FormControl, Validators} from "@angular/forms";

export interface dataIn {
  button: string;
  title: string;
  subtitle: string;
  message: string[];
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent {

  public password = new FormControl({value: '', disabled: false}, Validators.required);

  constructor(
      public dialogRef: MatDialogRef<ResetPasswordComponent>,
      @Inject(MAT_DIALOG_DATA) public data: dataIn,
      private snackBar: MatSnackBar,
  ) { }

  confirm(){
    if (this.password.valid) {
      this.dialogRef.close({ password: this.password.value});
    } else {
      this.presentToast('Invalid password', 'yellow-snackbar');
    }
  }
  dismiss(): void {
    this.dialogRef.close();
  }

  // ----------------------------//
  // Present toast method //
  // ----------------------------//
  presentToast(message: string, style: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [style],
      horizontalPosition: 'end',
      verticalPosition: document.documentElement.clientWidth >= 1050 ? 'top' : 'bottom'
    });
  }

}
