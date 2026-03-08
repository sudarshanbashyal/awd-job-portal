import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationModal } from './add-education-modal';

describe('AddEducationModal', () => {
  let component: AddEducationModal;
  let fixture: ComponentFixture<AddEducationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEducationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEducationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
