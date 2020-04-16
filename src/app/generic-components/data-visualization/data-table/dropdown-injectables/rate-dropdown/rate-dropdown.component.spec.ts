import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDropdownComponent } from './rate-dropdown.component';

describe('RateDropdownComponent', () => {
  let component: RateDropdownComponent;
  let fixture: ComponentFixture<RateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
