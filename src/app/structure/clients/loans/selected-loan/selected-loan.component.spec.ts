import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedLoanComponent } from './selected-loan.component';

describe('SelectedLoanComponent', () => {
  let component: SelectedLoanComponent;
  let fixture: ComponentFixture<SelectedLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
