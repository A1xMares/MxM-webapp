import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoresTableComponent } from './advisores-table.component';

describe('AdvisoresTableComponent', () => {
  let component: AdvisoresTableComponent;
  let fixture: ComponentFixture<AdvisoresTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisoresTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
