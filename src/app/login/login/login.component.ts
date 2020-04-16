import {AfterViewInit, Component, Inject, OnDestroy, OnInit, NgZone, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {takeUntil} from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MessageModalComponent} from '../../modals/desicion-modals/message-modal/message-modal.component';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loading = false;

  // Component constructor //
  constructor(
      private authService: AuthService,
      private apiService: ApiService,
      private fb: FormBuilder,
      private router: Router,
      private zone: NgZone,
      private activateRoute: ActivatedRoute,
      private snackBar: MatSnackBar,
      private dialog: MatDialog,
      private titleService: Title
  ) {
    this.setTitle('Iniciar sesión | MXM');
  }

  // Local variables declaration //
  private onDestroy = new Subject<void>();
  private firstLoad = true;

  // FormGroup declaration //
  public loginForm = this.fb.group({
    username: new FormControl({value: '', disabled: false}, Validators.required),
    password: new FormControl({value: '', disabled: false}, Validators.required)
  });

  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue && this.firstLoad) {
      this.navigate(this.authService.currentUserValue);
    } else {
      this.authService.userObservable.pipe(takeUntil(this.onDestroy)).subscribe((user) => {
        if (user && this.firstLoad) {
          this.navigate(user);
        }
      });
    }
  }

  // Perform login function //
  performLogin() {
    if (this.loginForm.status === 'INVALID') {
      this.presentToast('Usuario o contraseña inválidos');
    } else {
      this.loading = true;
      this.firstLoad = false;
      const user: string = this.loginForm.get('username').value;
      const loginObject: any = {
        password: this.loginForm.get('password').value
      };
      if (user.includes('@')) {
        if (user.includes('.')) {
          loginObject.email = user.toLowerCase();
        } else {
          this.presentToast('The email is incorrect');
          return;
        }
      } else {
        loginObject.username = user;
      }
      this.authService.login(loginObject).pipe(takeUntil(this.onDestroy)).subscribe((loggedUser: any) => {
        this.loading = false;
        if (loggedUser) {
          this.navigate(loggedUser);
        } else {
          this.presentAlert('Error de autenticación', 'Por favor, verifica tus credenciales.');
        }
      }, (err) => {
        this.loading = false;
        this.presentAlert('Error',  err);
      });
    }
  }

  // Forgot Password //
  password() {
    this.router.navigate(['/forgot_password']).catch();
  }

  // Show toast on invalid login //
  presentToast(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['yellow-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: document.documentElement.clientWidth >= 1050 ? 'top' : 'bottom'
    });
  }

  // Show alert on invalid login //
  presentAlert(title, msg) {
    this.dialog.open(MessageModalComponent, {
      width: '300px',
      data: {
        title,
        msg
      }
    });
  }

  // On destroy lifecycle //
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  navigate(user) {
    this.router.navigate(['inicio']).then(() => {
    }).catch();
  }
}
