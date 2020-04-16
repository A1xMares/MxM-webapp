import {AfterViewInit, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {MatMenu} from '@angular/material/menu';
import {Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ApiService} from '../../../services/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {QueryFactory} from '../../../tableQueries/queryFactory';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth/auth.service';
import {SharingService} from '../../../services/sharing/sharing.service';
declare const google: any;

@Component({
  selector: 'app-google-map-range',
  templateUrl: './google-map-range.component.html',
  styleUrls: ['./google-map-range.component.scss']
})
export class GoogleMapRangeComponent implements OnInit, AfterViewInit {

  public isActive = false;

  map: any;
  circle = null;

  public searchPoint: any;

  @ViewChild('menuDropDown') dropDown: MatMenu;
  @ViewChild('mapContainer', {static: true}) mapContainer;

  @Input()
  set prevValues(data) {
    if (data[0]) {
      this.search.patchValue(data[0].search);
      this.radius.patchValue(data[0].radius);
      this.searchPoint = data[0].geoPoint;
      this.setRange();
    }
  }

  @Input()
  set config(config) {
    this.configObject = config;
  }

  @Output() filterContent = new EventEmitter();

  /* manage component */
  private onDestroy = new Subject<void>();
  public configObject: any;

  /* Form crud-inputs & validations declaration */
  public search = new FormControl({value: '', disabled: false});
  public radius = new FormControl({value: '', disabled: false});

  public placeAutocomplete;

  constructor(
      private apiService: ApiService,
      public router: Router,
      public route: ActivatedRoute,
      public queryFactory: QueryFactory,
      public dialog: MatDialog,
      public authService: AuthService,
      private sharingService: SharingService,
      private zone: NgZone,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public setGoogleAutocomplete() {

    if (!this.map) {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 20.6518948, lng: -103.407928},
        zoom: 1,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'cooperative'
      });

      if (this.circle) {
        this.circle.setMap(this.map);
      }
    }

    if (this.circle && this.map) {
      setTimeout(() => {
        this.map.fitBounds(this.circle.getBounds());
      }, 100);
    }

    if (!this.placeAutocomplete) {
      this.placeAutocomplete = new google.maps.places.Autocomplete(document.getElementById('addressWrapper'), {});

      google.maps.event.addListener(this.placeAutocomplete, 'place_changed', () => {
        /* Emit the new address object for the updated place */
        if (this.placeAutocomplete.getPlace()) {
          this.zone.run(() => {
            this.searchPoint = {
              lat: this.placeAutocomplete.getPlace().geometry.location.lat(),
              lng: this.placeAutocomplete.getPlace().geometry.location.lng(),
              selectedText: this.placeAutocomplete.getPlace().formatted_address
            };
            this.search.patchValue((document.getElementById('addressWrapper') as HTMLInputElement).value);
          });
        } else {
          this.searchPoint = false;
        }
      });
    }
  }

  setRange() {
    if (this.radius.value && this.searchPoint) {
      this.setPoint(this.searchPoint, this.radius.value * 1000);
    }
  }

  setPoint(addressEvent, radius: number) {
    if (this.circle !== null) {
      this.circle.setMap(null);
    }

    this.circle = new google.maps.Circle({
      strokeColor: '#f76b1c',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#f76b1c',
      fillOpacity: 0.45,
      map: this.map,
      center: { lat: addressEvent.lat, lng: addressEvent.lng },
      radius
    });

    console.log('circle', this.circle);

    if (this.map) {
      this.circle.setMap(this.map);
      this.map.fitBounds(this.circle.getBounds());
    }

    this.calculateFilter();
  }

  calculateFilter() {
    console.log('calculating filter');
    if (this.radius.value && this.circle) {
      const orObject: any[] = [];
      for (let x = 0; x < 40; x++) {
        const startPoint = google.maps.geometry.spherical.computeOffset(this.circle.getCenter(), (this.radius.value * 1000), (4.5 * x));
        const endPoint = google.maps.geometry.spherical.computeOffset(this.circle.getCenter(), (this.radius.value * 1000), ((4.5 * x) + 180));
        if (x !== 0 && x !== 4) {
          orObject.push({
            and: [
              { ['location.lat']: {between: [((4.5 * x) < 90) ? endPoint.lat() : startPoint.lat() , ((4.5 * x) < 90) ? startPoint.lat() : endPoint.lat()]} },
              { ['location.lng']: {between: [endPoint.lng(), startPoint.lng()]} },
            ]
          });
        }
      }
      this.isActive = true;
      this.filterContent.emit([{search: this.search.value, filterObj: orObject, radius: this.radius.value, geoPoint: this.searchPoint}]);
    }
  }

  clearFilter() {
    this.searchPoint = false;
    this.radius.patchValue('');
    this.search.patchValue('');
    if (this.circle) {
      this.circle.setMap(null);
    }
    this.isActive = false;
    this.filterContent.emit([]);
  }

}
