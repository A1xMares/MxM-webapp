import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedAdvisorComponent } from './selected-advisor.component';

describe('SelectedAdvisorComponent', () => {
  let component: SelectedAdvisorComponent;
  let fixture: ComponentFixture<SelectedAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
