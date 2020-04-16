import {AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LeafletDirective} from '@asymmetrik/ngx-leaflet';
import {Subject} from 'rxjs';
import {latLng, polygon, tileLayer} from 'leaflet';
import * as L from 'leaflet';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {QueryFactory} from '../../../../tableQueries/queryFactory';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DataTableColumnTypes} from '../../../../models/datatables/data-table-column-types';
import {takeUntil} from 'rxjs/operators';
import {ModalConfirmComponent} from '../../../../modals/desicion-modals/modal-confirm/modal-confirm.component';
import {fadeInBottom, fadeInTop} from '../../../../animations/animatedComponents';
import {AuthService} from '../../../../services/auth/auth.service';
import {BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout';
import {MatStepper} from '@angular/material/stepper';

declare const google: any;

@Component({
  selector: 'app-selected-client',
  templateUrl: './selected-client.component.html',
  styleUrls: ['./selected-client.component.scss'],
  animations: [...fadeInTop, ...fadeInBottom]
})
export class SelectedClientComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  private onDestroy = new Subject<void>();

  public placeAutocomplete;
  public guaranteeAutocomplete;
  public searchPoint: any;
  public guaranteePoint: any;

  public zoneOptions: any[] = [];
  public businessTurnOptions: any[] = [];

  public today = new Date();

  public client: any;
  public isEdit = false;
  public isNew = false;
  public firstLoad = true;

  private hasPopups = false;
  private popUpsHandler: any[] = [];

  private mobileQueryListener: () => void;
  public mobileQuery: MediaQueryList;

  prevLayers = [];
  prevBounds: any;
  mapRef: any;

  center = latLng(20.627513, -103.259217);
  zoom = 12;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 12,
    center: latLng(20.627513, -103.259217)
  };

  public marker;
  public markerPosition = 0;

  public documents = true;

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private queryFactory: QueryFactory,
    public router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private colTypes: DataTableColumnTypes,
    private zone: NgZone,
    private authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  dataForm = this.fb.group({
    birthdate: new FormControl({value: '', disabled: false}, [Validators.required]),
    firstname: new FormControl({value: '', disabled: false}, [Validators.required]),
    lastname: new FormControl({value: '', disabled: false}, [Validators.required]),
    phone: new FormControl({value: '', disabled: false}, [Validators.required]),
    phoneRef: new FormControl({value: '', disabled: false}, [Validators.required]),
    rfc: new FormControl({value: '', disabled: false}, [Validators.required]),
    businessTurn: new FormControl({value: '', disabled: false}, [Validators.required]),
    status: new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  locationForm = this.fb.group({
    address: new FormControl({value: '', disabled: false}, [Validators.required]),
    reference: new FormControl({value: '', disabled: false}, [Validators.required]),
    zoneId: new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  guaranteeForm = this.fb.group({
    name: new FormControl({value: '', disabled: false}, [Validators.required]),
    birthdate: new FormControl({value: '', disabled: false}, [Validators.required]),
    address: new FormControl({value: '', disabled: false}, [Validators.required]),
    reference: new FormControl({value: '', disabled: false}, [Validators.required]),
    phone: new FormControl({value: '', disabled: false}, [Validators.required]),
    phoneRef: new FormControl({value: '', disabled: false}, [Validators.required]),
    rfc: new FormControl({value: '', disabled: false}, [Validators.required]),
    // businessTurn: new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  docsForm = this.fb.group({
    name: new FormControl({value: '', disabled: false}, [Validators.required]),
    birthdate: new FormControl({value: '', disabled: false}, [Validators.required]),
    address: new FormControl({value: '', disabled: false}, [Validators.required]),
    reference: new FormControl({value: '', disabled: false}, [Validators.required]),
    firstname: new FormControl({value: '', disabled: false}, [Validators.required]),
    lastname: new FormControl({value: '', disabled: false}, [Validators.required]),
    phone: new FormControl({value: '', disabled: false}, [Validators.required]),
    phoneRef: new FormControl({value: '', disabled: false}, [Validators.required]),
    rfc: new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit() {
    if (this.router.url.indexOf('nuevo') !== -1) {
      this.getZones();
      this.getTurns();
      this.isNew = true;
      this.isEdit = true;
      this.setTitle('Nuevo cliente | MXM');
    } else {
      this.loadCurrentClient(this.route.snapshot.paramMap.get('id'));
    }
  }

  getZones() {
    this.apiService.getDataObjects('zones?filter=' + JSON.stringify({
      fields: ['name', 'points', 'id']
    })).pipe(
      takeUntil(this.onDestroy)
    ).subscribe((data: any) => {
      this.zoneOptions = data.data.map((zone) => ({id: zone.id, name: zone.name}));
      this.prevLayers = data.data.map((poly) => (polygon(poly.points ? poly.points.map((geo) => [geo.lat, geo.lng]) : [], )));
      if (!this.isNew && this.client) {
        this.locationForm.patchValue({zoneId: this.client.zoneId});
      }
      if (this.mapRef) {
        this.setZoneNames();
      }
    });
  }

  getTurns() {
    this.apiService.getDataObjects('business-turns').pipe(
      takeUntil(this.onDestroy)
    ).subscribe((data: any) => {
      this.businessTurnOptions = data.data;
      if (!this.isNew && this.client) {
        this.dataForm.patchValue({businessTurn: this.client.businessTurn});
      }
    });
  }

  centerChange() {

  }

  loadCurrentClient(id: string) {
    this.apiService.getDataObject('clients', id).pipe(takeUntil(this.onDestroy)).subscribe((data: any) => {

      this.client = data;

      if (this.firstLoad) {
        this.firstLoad = false;
        this.getZones();
        this.getTurns();
      }

      this.searchPoint = this.client.location.coordinates;
      this.guaranteePoint = this.client.location.coordinates;
      this.dataForm.patchValue({ ...data });
      this.locationForm.patchValue({ ...data.location });
      this.guaranteeForm.patchValue({
        ...data.guarantee,
        address: data.guarantee.location.address,
        reference: data.guarantee.location.reference,
      });
      this.setTitle(data.firstname + ' ' + data.lastname + ' - Cliente | MXM');

      if (data.location) {
        this.setMarker();
      }
    });
  }

  resetValues() {
    this.dataForm.patchValue({ ...this.client });
    this.locationForm.patchValue({ ...this.client.location });
    this.guaranteeForm.patchValue({ ...this.client.guarantee });
    this.searchPoint = this.client.location.coordinates;
    this.removeMarker();
    this.setMarker();
  }

  removeMarker() {
    this.marker.removeFrom(this.mapRef);
  }

  setMarker() {
    const tmpIcon = L.icon({
      iconUrl: '../../../../../assets/img/client_pin.png',
      iconSize: [45, 45],
      iconAnchor: [22.5, 45],
    });
    this.marker = L.marker([this.searchPoint.lat, this.searchPoint.lng], {
      icon: tmpIcon,
      riseOnHover: true,
      riseOffset: 1000
    }).addTo(this.mapRef);
    this.zoom = 13;
    this.center = latLng(this.searchPoint.lat, this.searchPoint.lng);
  }

  performRequest() {
    if (this.dataForm.status === 'INVALID') {
      this.presentToast('Error en formulario "Datos"', 'yellow-snackbar');
    } else if (this.locationForm.status === 'INVALID' || !this.searchPoint) {
      this.presentToast('Error en formulario "Ubicación"', 'yellow-snackbar');
    } else if (this.guaranteeForm.status === 'INVALID' || !this.guaranteePoint) {
      this.presentToast('Error en formulario "Aval"', 'yellow-snackbar');
    } else if (!this.documents) {
      this.presentToast('Error en documentos', 'yellow-snackbar');
    } else {

      let client = {
        ...this.dataForm.value,
        zoneId: this.locationForm.get('zoneId').value,
        birthdate: this.getFormattedDate(this.dataForm.get('birthdate').value),

        location: {
          ...this.locationForm.value,
          coordinates: this.searchPoint
        },
        guarantee: {
          ...this.guaranteeForm.value,
          birthdate: this.getFormattedDate(this.guaranteeForm.get('birthdate').value),
          location: {
            address: this.guaranteeForm.get('address').value,
            reference: this.guaranteeForm.get('reference').value,
            coordinates: this.guaranteePoint
          },
        }
      };

      delete client.guarantee.address;
      delete client.guarantee.reference;

      if (this.isNew) {

        client = {
          ...client,
          createTime: new Date(),
          updateTime: new Date(),
          addedById: this.authService.currentUserValue.id,
          entityState: '-',
          // documents: [{}],
          profilePhoto: {key: 'PROFILE_PHOTO', data: 'test'}
        };

        console.log(client);

        this.apiService.addDataObject(client, 'clients').pipe(
          takeUntil(this.onDestroy)
        ).subscribe((data: any) => {
          this.presentToast('Cliente creado correctamente', 'green-snackbar');
          this.client = data;
          this.isEdit = false;
          if (this.isNew) {
            this.isNew = false;
            this.router.navigate(['clientes/' + data.id]).catch();
          }
          this.setTitle(data.firstname + ' ' + data.lastname + ' - Cliente | MXM');
        }, err => {
          this.presentToast('Error de conexión', 'red-snackbar');
        });

      } else {

        client = {
          ...client,
          updateTime: new Date(),
        };

        this.apiService.editDataObject(this.client.id, client, 'clients').pipe(
          takeUntil(this.onDestroy)
        ).subscribe((data: any) => {
          console.log(data);
          this.presentToast('Cliente creado correctamente', 'green-snackbar');
          this.client = data;
          this.isEdit = false;
          this.setTitle(data.firstname + ' ' + data.lastname + ' - Cliente | MXM');
        }, err => {
          this.presentToast('Error de conexión', 'red-snackbar');
        });

      }
    }
  }

  getFormattedDate(date: any) {
    const newDate = new Date(date);
    return (
      (newDate.getFullYear() + '-' +
      ((newDate.getMonth() + 1 < 10 ? ('0' + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1))) + '-' +
      ((newDate.getDate() < 10 ? ('0' + (newDate.getDate())) : (newDate.getDate()))))
    );
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
    this.setGoogleAutocomplete();
  }

  public setGoogleAutocomplete() {
    if (!this.placeAutocomplete) {
      this.placeAutocomplete = new google.maps.places.Autocomplete(document.getElementById('addressWrapper'), {});
      this.guaranteeAutocomplete = new google.maps.places.Autocomplete(document.getElementById('guaranteeAddress'), {});

      this.placeAutocomplete.setComponentRestrictions({country: ['mx']});
      this.guaranteeAutocomplete.setComponentRestrictions({country: ['mx']});

      google.maps.event.addListener(this.placeAutocomplete, 'place_changed', () => {
        /* Emit the new address object for the updated place */
        if (this.placeAutocomplete.getPlace()) {
          this.zone.run(() => {
            if (this.searchPoint) {
              this.removeMarker();
            }
            this.searchPoint = {
              lat: this.placeAutocomplete.getPlace().geometry.location.lat(),
              lng: this.placeAutocomplete.getPlace().geometry.location.lng()
            };
            this.locationForm.get('address').patchValue((document.getElementById('addressWrapper') as HTMLInputElement).value);
            this.setMarker();
          });
        } else {
          this.searchPoint = false;
        }
      });

      google.maps.event.addListener(this.guaranteeAutocomplete, 'place_changed', () => {
        /* Emit the new address object for the updated place */
        if (this.guaranteeAutocomplete.getPlace()) {
          this.zone.run(() => {
            this.guaranteePoint = {
              lat: this.guaranteeAutocomplete.getPlace().geometry.location.lat(),
              lng: this.guaranteeAutocomplete.getPlace().geometry.location.lng()
            };
            this.guaranteeForm.get('address').patchValue((document.getElementById('guaranteeAddress') as HTMLInputElement).value);
            this.setMarker();
          });
        } else {
          this.searchPoint = false;
        }
      });
    }
  }

  mapLoaded(mapEvent: L.Map) {
    this.mapRef = mapEvent;
    const tmpIcon = L.icon({
      iconUrl: '../../../../../assets/img/home_pin.png',
      iconSize: [35, 35],
      iconAnchor: [17.5, 35],
    });
    L.marker([20.627513, -103.259217], {
      icon: tmpIcon,
      title: 'Sucursal matriz, Avenida Río Nilo 8154, Loma Dorada, Tonalá Jalisco',
      riseOnHover: true,
      riseOffset: 1000
    }).addTo(this.mapRef);
    if (this.zoneOptions.length > 0) {
      this.setZoneNames();
    }
  }

  invalidateMap() {
    setTimeout(() => {
      this.mapRef.invalidateSize();
    }, 100);
  }

  setZoneNames() {
    if (!this.hasPopups) {
      if (this.popUpsHandler.length > 0) {
        this.popUpsHandler.forEach((popUp) => {
          popUp.removeFrom(this.mapRef);
        });
        this.popUpsHandler = [];
      }
      this.hasPopups = true;
      this.zoneOptions.forEach((zone, index) => {
        const center = this.prevLayers[index].getBounds().getCenter();
        const tmp = L.popup({
          closeButton: false,
          autoClose: false,
          closeOnClick: false,
          closeOnEscapeKey: false,
          className: 'customPopup'
        })
          .setLatLng(center)
          .setContent(this.zoneOptions[index].name)
          .openOn(this.mapRef);
        this.popUpsHandler.push(tmp);
      });
      this.center = latLng(this.searchPoint ? this.searchPoint.lat : 20.627513, this.searchPoint ? this.searchPoint.lng : -103.259217);
    }
  }

  delete() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      data: {
        button: 'Eliminar',
        title: 'Cliente',
        subtitle: '¿Seguro de eliminar este cliente?',
        message: []
      },
      autoFocus: false
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result => {
      if (result !== undefined) {
        if (result.confirmation) {
          this.apiService.deleteDataObject('clients', this.client.id).pipe(
            takeUntil(this.onDestroy)
          ).subscribe(() => {
            this.presentToast('Cliente eliminada correctamente', 'green-snackbar');
            this.router.navigate(['clientes']).catch();
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
