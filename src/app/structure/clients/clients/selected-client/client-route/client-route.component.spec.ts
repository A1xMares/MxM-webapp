import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRouteComponent } from './client-route.component';

describe('ClientRouteComponent', () => {
  let component: ClientRouteComponent;
  let fixture: ComponentFixture<ClientRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
