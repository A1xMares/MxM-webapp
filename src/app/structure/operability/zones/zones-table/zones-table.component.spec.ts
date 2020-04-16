import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesTableComponent } from './zones-table.component';

describe('ZonesTableComponent', () => {
  let component: ZonesTableComponent;
  let fixture: ComponentFixture<ZonesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
