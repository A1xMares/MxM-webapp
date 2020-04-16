import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {QueryFactory} from '../../../../tableQueries/queryFactory';
import {ApiService} from '../../../../services/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {fadeInBottom, fadeInTop} from '../../../../animations/animatedComponents';
import {MatDialog} from '@angular/material/dialog';
import {ModalConfirmComponent} from '../../../../modals/desicion-modals/modal-confirm/modal-confirm.component';
import {ResetPasswordComponent} from '../../../../modals/crud-modals/reset-password/reset-password.component';

@Component({
  selector: 'app-selected-user',
  templateUrl: './selected-user.component.html',
  styleUrls: ['./selected-user.component.scss'],
  animations: [...fadeInTop, ...fadeInBottom]
})
export class SelectedUserComponent implements OnInit, AfterViewInit, OnDestroy {

  private onDestroy = new Subject<void>();

  public user: any;
  public isEdit = false;
  public isNew = false;

  public branchOptions: any[] = [];

  constructor(
      private titleService: Title,
      private fb: FormBuilder,
      private apiService: ApiService,
      private snackBar: MatSnackBar,
      private queryFactory: QueryFactory,
      public router: Router,
      private route: ActivatedRoute,
      private dialog: MatDialog,
  ) {}

  addForm = this.fb.group({
    firstname: new FormControl({value: '', disabled: false}, [Validators.required]),
    lastname: new FormControl({value: '', disabled: false}, Validators.required),
    role: new FormControl({value: 'ADVISER', disabled: false}, Validators.required),
    username: new FormControl({value: '', disabled: false}, Validators.required),
    email: new FormControl({value: '', disabled: false}, Validators.required),
    branchId: new FormControl({value: '', disabled: false}, Validators.required),
  });

  passForm = this.fb.group({
    password: new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  // ---------------- //
  // Set title method //
  // ---------------- //
  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit() {
    if (this.router.url.indexOf('nuevo') !== -1) {
      this.isNew = true;
      this.setTitle('Nuevo Usuario | MXM');
    } else {
      this.loadCurrentUser(this.route.snapshot.paramMap.get('id'));
    }
    this.getBranches();
  }

  getBranches() {
    this.apiService.getDataObjects('branches').pipe(takeUntil(this.onDestroy)).subscribe((data: any) => {
      this.branchOptions = [data];
      if (!this.isNew && this.user) {
        this.addForm.patchValue({branchId: this.user.branchId});
      }
    });
  }

  loadCurrentUser(id: string) {
    this.apiService.getDataObject('AppUsers', id).pipe(takeUntil(this.onDestroy)).subscribe((user: any) => {
      this.user = user;
      this.addForm.patchValue({ ...user });
      this.setTitle(user.firstname + ' ' + user.lastname + ' - Usuario | MXM');
    });
  }

  performRequest() {
    if (this.addForm.status === 'INVALID') {
      this.presentToast('Error en formulario', 'yellow-snackbar');
      console.log(this.addForm);
    } else {

      let user = { ...this.addForm.value };

      if (this.isNew) {

        if (this.passForm.status === 'INVALID') {
          this.presentToast('Error en formulario', 'yellow-snackbar');
        } else {

          console.log(this.passForm);

          user = { ...user, ...this.passForm.value };

          this.apiService.addDataObject(user, 'AppUsers').pipe(takeUntil(this.onDestroy)).subscribe((data: any) => {
            this.presentToast('Usuario creado correctamente', 'green-snackbar');
            this.user = data;
            if (this.isNew) {
              this.isNew = false;
              this.router.navigate(['usuarios/' + user.id]).catch();
            }
            this.setTitle(user.firstname + ' ' + user.lastname + ' - Usuario | MXM');
          }, err => {
            this.presentToast('Error de conexión', 'red-snackbar');
          });

        }

      } else {

        this.apiService.editDataObject(this.user.id, user, 'AppUsers').pipe(takeUntil(this.onDestroy)).subscribe((data: any) => {
          this.presentToast('Usuario editado correctamente', 'green-snackbar');
          this.user = data;
          this.isEdit = false;
          this.setTitle(user.firstname + ' ' + user.lastname + ' - Usuario | MXM');
        }, err => {
          this.presentToast('Error de conexión', 'red-snackbar');
        });

      }
    }
  }

  // ---------------------//
  // Present toast method //
  // ---------------------//
  presentToast(message: string, style: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [style],
      horizontalPosition: 'end',
      verticalPosition: document.documentElement.clientWidth >= 1050 ? 'top' : 'bottom'
    });
  }

  ngAfterViewInit(): void {

  }

  delete() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      data: {
        button: 'Eliminar',
        title: 'Usuario',
        subtitle: '¿Seguro de eliminar este usuario?',
        message: []
      },
      autoFocus: false
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result => {
      if (result !== undefined) {
        if (result.confirmation) {
          this.apiService.deleteDataObject('AppUsers', this.user.id).pipe(takeUntil(this.onDestroy)).subscribe(() => {
            this.presentToast('Usuario eliminado correctamente', 'green-snackbar');
          });
        }
      }
    });
  }

  changePassword() {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      data: {
        button: 'Guardar',
        title: 'Usuario',
        subtitle: 'Cambiar contraseña',
        message: []
      },
      width: '350px',
      autoFocus: false
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result => {
      if (result !== undefined) {
        if (result.password) {
          this.apiService.editDataObject(this.user.id, {password: result.password}, 'AppUsers').pipe(takeUntil(this.onDestroy)).subscribe(() => {
            this.presentToast('Contraseña cambiada correctamente', 'green-snackbar');
          }, err => {
            this.presentToast('Error al cambiar la contraseña', 'red-snackbar');
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

}
