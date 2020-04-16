import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsHistoryComponent } from './visits-history.component';

describe('VisitsHistoryComponent', () => {
  let component: VisitsHistoryComponent;
  let fixture: ComponentFixture<VisitsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
