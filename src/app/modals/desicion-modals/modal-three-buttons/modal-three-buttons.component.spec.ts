import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalThreeButtonsComponent } from './modal-three-buttons.component';

describe('ModalThreeButtonsComponent', () => {
  let component: ModalThreeButtonsComponent;
  let fixture: ComponentFixture<ModalThreeButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalThreeButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalThreeButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
