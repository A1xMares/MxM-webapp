import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneClientsComponent } from './zone-clients.component';

describe('ZoneClientsComponent', () => {
  let component: ZoneClientsComponent;
  let fixture: ComponentFixture<ZoneClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
