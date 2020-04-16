import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimateSelectComponent } from './ultimate-select.component';

describe('UltimateSelectComponent', () => {
  let component: UltimateSelectComponent;
  let fixture: ComponentFixture<UltimateSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltimateSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
