import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedZoneComponent } from './selected-zone.component';

describe('SelectedZoneComponent', () => {
  let component: SelectedZoneComponent;
  let fixture: ComponentFixture<SelectedZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
