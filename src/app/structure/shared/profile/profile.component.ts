// -----------------------------------//
// Dependencies and libraries imports //
// -----------------------------------//
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api/api.service';
import {AuthService} from '../../../services/auth/auth.service';
import {QueryFactory} from '../../../tableQueries/queryFactory';
import {Subject} from 'rxjs';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  // --------------------- //
  // Component constructor //
  // --------------------- //
  constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private authService: AuthService,
      private queryFactory: QueryFactory,
      private snackBar: MatSnackBar,
      private titleService: Title
  ) {
    this.setTitle('Perfil | MXM');
  }

  // --------------------------- //
  // Local variables declaration //
  // --------------------------- //
  private onDestroy = new Subject<void>();

  // --------------------------------------//
  // Form crud-inputs & validations declaration //
  // --------------------------------------//
  addForm = this.fb.group({
    name: new FormControl({value: '', disabled: false}, Validators.required),
    email: new FormControl({value: '', disabled: false}, Validators.required),
  });

  // ---------------- //
  // Set title method //
  // ---------------- //
  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  // ------------------ //
  // On view init cycle //
  // ------------------ //
  ngOnInit(): void {

  }

  // ----------------------------//
  // Add data object to database //
  // ----------------------------//
  performRequest() {

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

  // -------------------- //
  // On destroy lifecycle //
  // -------------------- //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}


