import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneAsvisersComponent } from './zone-asvisers.component';

describe('ZoneAsvisersComponent', () => {
  let component: ZoneAsvisersComponent;
  let fixture: ComponentFixture<ZoneAsvisersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneAsvisersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneAsvisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
