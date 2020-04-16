import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRouteComponent } from './selected-route.component';

describe('SelectedRouteComponent', () => {
  let component: SelectedRouteComponent;
  let fixture: ComponentFixture<SelectedRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
