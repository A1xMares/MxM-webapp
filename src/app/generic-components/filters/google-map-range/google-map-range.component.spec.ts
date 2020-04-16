import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapRangeComponent } from './google-map-range.component';

describe('GoogleMapRangeComponent', () => {
  let component: GoogleMapRangeComponent;
  let fixture: ComponentFixture<GoogleMapRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
