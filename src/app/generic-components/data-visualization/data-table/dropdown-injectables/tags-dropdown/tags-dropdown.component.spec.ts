import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsDropdownComponent } from './tags-dropdown.component';

describe('TagsDropdownComponent', () => {
  let component: TagsDropdownComponent;
  let fixture: ComponentFixture<TagsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
