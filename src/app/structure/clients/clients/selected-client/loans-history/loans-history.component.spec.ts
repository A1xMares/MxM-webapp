import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansHistoryComponent } from './loans-history.component';

describe('LoansHistoryComponent', () => {
  let component: LoansHistoryComponent;
  let fixture: ComponentFixture<LoansHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoansHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
