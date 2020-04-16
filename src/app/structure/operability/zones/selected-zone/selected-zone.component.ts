import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ApiService} from '../../../../services/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {QueryFactory} from '../../../../tableQueries/queryFactory';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {circle, latLng, marker, polygon, tileLayer} from 'leaflet';
import {DataTableColumnTypes} from '../../../../models/datatables/data-table-column-types';
import * as L from 'leaflet';
import {fadeInBottom, fadeInTop} from '../../../../animations/animatedComponents';
import {LeafletDirective} from '@asymmetrik/ngx-leaflet';
import {ModalConfirmComponent} from '../../../../modals/desicion-modals/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-selected-zone',
  templateUrl: './selected-zone.component.html',
  styleUrls: ['./selected-zone.component.scss'],
  animations: [...fadeInTop, ...fadeInBottom]
})
export class SelectedZoneComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map', {static: true}) map: LeafletDirective;
  private onDestroy = new Subject<void>();

  public branchOptions: any[] = [];

  public zone: any;
  public prevPolygon: any;
  public currentPolygon: any;
  public isEdit = false;
  public isNew = false;
  public hasPolygonCreated = false;

  prevLayers = [];
  prevBounds: any;

  currentLayer: any[];

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 10,
    center: latLng(20.659698, -103.349609)
  };

  drawnItems = new L.FeatureGroup();

  drawOptions = {
    position: 'topright',
    draw: {
      polyline: false,
      circle: false,
      marker: false,
      circlemarker: false,
      rectangle: false,
      polygon: {
        allowIntersection: false,
        drawError: {
          message: 'Cierra el poligono en un vertice' // Message that will show when intersect
        }
      },
    }, edit: {
      featureGroup: this.drawnItems
    }
  };

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
  ) {
    L.drawLocal.draw.toolbar.actions.text = 'Cancelar';
    L.drawLocal.draw.toolbar.finish.text = 'Terminar';
    L.drawLocal.draw.toolbar.undo.text = 'Quitar ultimo';
    L.drawLocal.draw.handlers.polygon.tooltip.start = 'Click para empezar a dibujar';
    L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Continua añadiendo puntos';
    L.drawLocal.draw.handlers.polygon.tooltip.end = 'Ya puedes cerrar el poligono';
    L.drawLocal.edit.toolbar.actions.save.text = 'Terminar';
    L.drawLocal.edit.toolbar.actions.cancel.text = 'Cancelar';
    L.drawLocal.edit.toolbar.actions.clearAll.text = 'Borrar todos';
    L.drawLocal.edit.handlers.edit.tooltip.text = 'Puedes arrastrar los puntos';
    L.drawLocal.edit.handlers.edit.tooltip.subtext = 'Click en cancelar para revertir los cambios';
    L.drawLocal.edit.handlers.remove.tooltip.text = 'Click en un poligono para removerlo';
  }

  addForm = this.fb.group({
    name: new FormControl({value: '', disabled: false}, [Validators.required]),
    branchId: new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  ngOnInit() {
    this.getBranches();
    if (this.router.url.indexOf('nuevo') !== -1) {
      this.isNew = true;
      this.isEdit = true;
      this.setTitle('Nueva zona | MXM');
      this.getPrevZones();
    } else {
      this.loadCurrentZone(this.route.snapshot.paramMap.get('id'));
    }
  }

  getBranches() {
    this.apiService.getDataObjects('branches').pipe(takeUntil(this.onDestroy)).subscribe((data: any) => {
      this.branchOptions = [data];
      if (!this.isNew && this.zone) {
        this.addForm.patchValue({branchId: this.zone.branchId});
      }
    });
  }

  getPrevZones() {
    this.apiService.getDataObjects('zones?filter=' + JSON.stringify({
      fields: ['name', 'points']
    })).pipe(
      takeUntil(this.onDestroy)
    ).subscribe((data: any) => {
      this.prevLayers = data.data.map((poly) => (polygon(poly.points ? poly.points.map((geo) => [geo.lat, geo.lng]) : [], {color: 'gray'})));
      this.prevBounds = polygon(data.data.map((poly) => (poly.points ? poly.points.map((geo) => [geo.lat, geo.lng]) : [] )));
    });
  }

  loadCurrentZone(id: string) {
    this.apiService.getDataObject('zones', id).pipe(takeUntil(this.onDestroy)).subscribe((data: any) => {
      data.formattedUpdateTime = this.colTypes.getFormattedDate(data.updateTime);
      this.zone = data;
      this.addForm.patchValue({ ...data });
      this.setTitle(data.name + ' - Zona | MXM');

      if (data.points) {
        this.prevPolygon = polygon(data.points.map((geo) => [geo.lat, geo.lng]));
        this.currentPolygon = polygon(data.points.map((geo) => [geo.lat, geo.lng]));
        this.drawnItems.addLayer(this.prevPolygon);
      }
    });
  }

  resetValues() {
    this.addForm.patchValue({ ...this.zone });
    this.drawnItems.clearLayers();
    this.drawnItems.addLayer(this.prevPolygon);
    this.currentPolygon = this.prevPolygon;
    this.currentLayer = this.zone.points;
    this.hasPolygonCreated = false;
  }

  performRequest() {
    if (this.addForm.status === 'INVALID' || !this.currentLayer) {
      if (!this.currentLayer) {
        this.presentToast('Error, el trazo de la zona no es válido', 'yellow-snackbar');
      } else {
        this.presentToast('Error en formulario', 'yellow-snackbar');
      }
    } else if (this.currentLayer) {
      if (this.currentLayer.length > 0) {

        let zone = { ...this.addForm.value, points: this.currentLayer };

        if (this.isNew) {

          zone = {
            ...zone,
            createTime: new Date(),
            updateTime: new Date(),
            entityState: '-',
          };

          this.apiService.addDataObject(zone, 'zones').pipe(
            takeUntil(this.onDestroy)
          ).subscribe((data: any) => {
            data.formattedUpdateTime = this.colTypes.getFormattedDate(data.updateTime);
            this.presentToast('Zona creada correctamente', 'green-snackbar');
            this.zone = data;
            this.isEdit = false;
            if (this.isNew) {
              this.isNew = false;
              this.router.navigate(['zonas/' + data.id]).catch();
            }
            this.setTitle(data.name + ' - Zona | MXM');
          }, err => {
            this.presentToast('Error de conexión', 'red-snackbar');
          });

        } else {

          zone = {
            ...zone,
            updateTime: new Date(),
          };

          this.apiService.editDataObject(this.zone.id, zone, 'zones').pipe(
            takeUntil(this.onDestroy)
          ).subscribe((data: any) => {
            console.log(data);
            this.presentToast('Zona editada correctamente', 'green-snackbar');
            this.zone = data;
            this.isEdit = false;
            this.setTitle(data.name + ' - Zona | MXM');
          }, err => {
            this.presentToast('Error de conexión', 'red-snackbar');
          });

        }
      } else {
        this.presentToast('Error, el trazo de la zona no es válido', 'yellow-snackbar');
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

  mapLoaded(map: any) {
    map.addLayer(this.drawnItems);
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
    }).addTo(map);
  }

  polygonCreated(pol: any) {
    this.drawnItems.clearLayers();
    this.currentPolygon = polygon(pol.layer.editing.latlngs[0][0]);
    this.drawnItems.addLayer(this.currentPolygon);
    this.currentLayer = pol.layer.editing.latlngs[0][0];
    this.hasPolygonCreated = true;
  }

  polygonEdited(pol: any) {
    if (this.isNew || this.hasPolygonCreated) {
      this.currentLayer = this.currentPolygon.editing.latlngs[0][0];
    } else {
      this.currentLayer = this.prevPolygon.editing.latlngs[0][0];
    }
  }

  polygonDeleted(pol: any) {
    if (pol.layer) {
      if (pol.layer.editing)  {
        this.currentLayer = pol.layer.editing.latlngs[0][0];
      } else {
        this.currentLayer = [];
      }
    } else {
      this.currentLayer = [];
    }
  }

  delete() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      data: {
        button: 'Eliminar',
        title: 'Zona',
        subtitle: '¿Seguro de eliminar esta zona?',
        message: []
      },
      autoFocus: false
    });
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result => {
      if (result !== undefined) {
        if (result.confirmation) {
          this.apiService.deleteDataObject('zones', this.zone.id).pipe(
            takeUntil(this.onDestroy)
          ).subscribe(() => {
            this.presentToast('Zona eliminada correctamente', 'green-snackbar');
            this.router.navigate(['zonas']).catch();
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
