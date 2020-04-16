import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneDataComponent } from './zone-data.component';

describe('ZoneDataComponent', () => {
  let component: ZoneDataComponent;
  let fixture: ComponentFixture<ZoneDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
