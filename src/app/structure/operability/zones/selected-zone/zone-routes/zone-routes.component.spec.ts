import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneRoutesComponent } from './zone-routes.component';

describe('ZoneRoutesComponent', () => {
  let component: ZoneRoutesComponent;
  let fixture: ComponentFixture<ZoneRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
